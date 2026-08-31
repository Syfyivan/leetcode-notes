/**
 * 手写 Promise.all
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 需求：接收一个 promise 数组，返回一个新 Promise：
 *   - 全部成功：resolve 一个"按原顺序"排列的结果数组；
 *   - 任意一个失败：立刻 reject 那个原因。
 *
 * 思路：
 * 1. 给每个 promise 编号，完成时写入对应下标。
 * 2. 计数器到齐再 resolve 整个数组。
 * 3. 任意一个 reject 立刻失败。非 Promise 值先包一层。
 *
 * ——— 示例 ———
 * 输入： [ Promise.resolve(1),
 *          100ms 后 resolve(2) 的 Promise,
 *          Promise.resolve(3) ]
 * 输出： 全部成功后 resolve -> [1, 2, 3]   （顺序和输入一致，不是谁先完成谁先排）
 *
 * ——— 常见追问 ———
 * Q: 为什么按下标写？
 * A: 完成有快有慢。push 会按完成序排，题目要输入序。
 *
 * Q: 空数组为什么特殊处理？
 * A: n=0 时 forEach 一次都不跑，done 到不了 n。规范就是立刻 []。
 *
 * Q: 非 Promise 值怎么办？
 * A: Promise.resolve 包一层。1 和已经成功的 Promise 一视同仁。
 *
 * Q: 已经失败了，别的还在跑吗？
 * A: 外层已经 reject，发出去的停不下来，结果丢掉。
 *
 * Q: 和 allSettled 怎么选？
 * A: 缺一不可用 all。每个结局都要收集用 allSettled。
 */

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    const n = list.length;
    if (n === 0) {
      resolve([]);
      return; // forEach 不跑就到不了 done === n
    }
    const results = new Array(n);
    let done = 0;
    list.forEach((p, i) => {
      Promise.resolve(p).then((val) => { // 普通值也当已经成功
        results[i] = val; // 按下标填，快的那个不能插到前面
        if (++done === n) resolve(results);
      }, reject);
    });
  });
}

/**
 * 延伸 1：给整组任务设置总超时
 *
 * 需求：所有任务必须在 timeout 毫秒内完成，否则以 TimeoutError 拒绝。
 *
 * 思路：基础 promiseAll 和超时 Promise 做 race；无论谁先落定都清掉 timer。
 * 注意：超时只是不再等待，已经发出的网络请求要配合 AbortController 才能真正停止。
 *
 * ——— 示例 ———
 * 输入：promiseAllWithTimeout([sleep(500)], 100)
 * 输出：约 100ms 后 reject TimeoutError
 */
function promiseAllWithTimeout(promises, timeout) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`Promise.all 超过 ${timeout}ms`);
      error.name = 'TimeoutError';
      reject(error);
    }, timeout);
  });
  return Promise.race([promiseAll(promises), timeoutPromise])
    .finally(() => clearTimeout(timer));
}

/**
 * 延伸 2：对象版 Promise.all
 *
 * 需求：输入对象的每个 value 都可能是 Promise，全部完成后仍按原 key 返回对象。
 * 典型场景：页面同时加载 user、permissions、settings，结果按名字读取比数组下标清楚。
 *
 * 思路：Object.entries 拆成键值对，只对 value 做 Promise.all，完成后再 Object.fromEntries。
 *
 * ——— 示例 ———
 * 输入：promiseAllObject({ user: Promise.resolve('A'), count: 2 })
 * 输出：{ user: 'A', count: 2 }
 */
function promiseAllObject(record) {
  const entries = Object.entries(record);
  return promiseAll(entries.map(([, value]) => value)).then((values) =>
    Object.fromEntries(entries.map(([key], index) => [key, values[index]]))
  );
}

// —— 自测 ——
promiseAll([
  Promise.resolve(1),
  new Promise((r) => setTimeout(() => r(2), 100)),
  Promise.resolve(3),
]).then((res) => console.log(res)); // [1, 2, 3]

module.exports = { promiseAll, promiseAllWithTimeout, promiseAllObject };
