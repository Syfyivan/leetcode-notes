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
 */

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    const n = list.length;
    if (n === 0) {
      resolve([]);
      return;
    }
    const results = new Array(n);
    let done = 0;
    list.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val; // 按下标填，快的那个不能插到前面
        if (++done === n) resolve(results);
      }, reject);
    });
  });
}

// —— 自测 ——
promiseAll([
  Promise.resolve(1),
  new Promise((r) => setTimeout(() => r(2), 100)),
  Promise.resolve(3),
]).then((res) => console.log(res)); // [1, 2, 3]

module.exports = { promiseAll };
