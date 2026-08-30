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
 * ——— 延伸 ———
 * - any：第一个成功就赢，全失败才 reject AggregateError。失败会被跳过。
 * - 空数组：race 永远 pending（没人敲门）；allSettled 立刻 []。
 * - 超时：`promiseRace([job, sleep(ms).then(() => Promise.reject('timeout'))])`。
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

module.exports = { promiseRace, promiseAllSettled };
