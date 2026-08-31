/**
 * 手写 Promise.race / allSettled
 *
 * 优先级：前端 P2 · 全栈 P1
 *
 * race：多个 promise 里，谁先敲定（成功或失败）就用谁的结果。
 * allSettled：等所有 promise 都敲定，返回每个的状态与结果
 *   （成功 { status: 'fulfilled', value }，失败 { status: 'rejected', reason }），永不 reject。
 *
 * 思路：
 * 1. race：谁先落定就用谁的结果，成功失败都算。
 * 2. allSettled：每个都等到，写成 {status, value/reason}。
 * 3. allSettled 不会 reject。结果顺序跟输入走。
 *
 * ——— 示例 ———
 * race 输入： [ 200ms 后 resolve('slow'), 50ms 后 resolve('fast') ]
 * race 输出： 'fast'   （最快敲定的胜出）
 *
 * allSettled 输入： [ Promise.resolve(1), Promise.reject('err') ]
 * allSettled 输出： [ {status:'fulfilled', value:1}, {status:'rejected', reason:'err'} ]
 *
 * ——— 常见追问 ———
 * Q: race 空数组为什么会 pending？
 * A: 没有 then 会被调用，resolve/reject 没人触发。规范就是挂着。
 *
 * Q: race 失败的那个先到会怎样？
 * A: 失败也算落定。先 reject 的会把整条 race 打成失败。
 *
 * Q: allSettled 为什么不会 reject？
 * A: 失败被收成 `{status:'rejected', reason}`。外层只等计数到齐，只走 resolve。
 *
 * Q: allSettled 为什么也要按下标写？
 * A: 完成顺序是乱的。第 i 个输入要对上第 i 个结局。
 *
 * Q: Promise.resolve(p) 在 race 里干什么？
 * A: 普通值立刻当成功。不然 `promiseRace([1, p])` 里 1 没有 then，轮不到它赢。
 */

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject); // 谁先落定谁赢，成功失败都算；普通值立刻当成功
    }
  });
}

function promiseAllSettled(promises) {
  return new Promise((resolve) => { // 没有 reject 通道，失败也当结果
    const list = Array.from(promises);
    const n = list.length;
    if (n === 0) {
      resolve([]);
      return; // 没人可等，直接交空结果
    }
    const results = new Array(n);
    let done = 0;
    list.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = { status: 'fulfilled', value }; // 按下标填，对上输入顺序
          if (++done === n) resolve(results);
        },
        (reason) => {
          results[i] = { status: 'rejected', reason };
          if (++done === n) resolve(results);
        }
      );
    });
  });
}

/**
 * 延伸 1：手写 Promise.any
 *
 * 需求：第一个成功的 Promise 胜出；失败项先记下来，只有全部失败才 reject AggregateError。
 * 错误数组也要按输入顺序排列。
 *
 * 思路：
 * 1. 任意 fulfilled 直接 resolve。
 * 2. rejected 按下标写入 errors，并累计失败数。
 * 3. 空可迭代或失败数到齐时，reject AggregateError。
 *
 * ——— 示例 ———
 * 输入：[Promise.reject('x'), Promise.resolve('ok')]
 * 输出：'ok'
 */
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    const errors = new Array(list.length);
    if (list.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }
    let rejected = 0;
    list.forEach((promise, index) => {
      Promise.resolve(promise).then(resolve, (error) => {
        errors[index] = error;
        if (++rejected === list.length) {
          reject(new AggregateError(errors, 'All promises were rejected'));
        }
      });
    });
  });
}

/**
 * 延伸 2：超时包装 withTimeout
 *
 * 需求：目标 Promise 在 timeout 毫秒内没有落定，就以 TimeoutError 拒绝。
 *
 * 思路：目标任务和超时任务做 race，结束后清理定时器。
 *
 * ——— 示例 ———
 * 输入：withTimeout(new Promise(r => setTimeout(r, 500)), 100)
 * 输出：约 100ms 后 reject TimeoutError
 */
function withTimeout(promise, timeout) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`任务超过 ${timeout}ms`);
      error.name = 'TimeoutError';
      reject(error);
    }, timeout);
  });
  return promiseRace([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// —— 自测 ——
promiseRace([
  new Promise((r) => setTimeout(() => r('slow'), 200)),
  new Promise((r) => setTimeout(() => r('fast'), 50)),
]).then((v) => console.log(v)); // 'fast'

promiseAllSettled([
  Promise.resolve(1),
  Promise.reject('err'),
]).then((v) => console.log(v));
// [{status:'fulfilled',value:1}, {status:'rejected',reason:'err'}]

module.exports = { promiseRace, promiseAllSettled, promiseAny, withTimeout };
