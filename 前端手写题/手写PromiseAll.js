/**
 * 手写 Promise.all
 *
 * 需求：接收一个 promise 数组，返回一个新 Promise：
 *   - 全部成功：resolve 一个"按原顺序"排列的结果数组；
 *   - 任意一个失败：立刻 reject 那个原因。
 *
 * ——— 示例 ———
 * 输入： [ Promise.resolve(1),
 *          100ms 后 resolve(2) 的 Promise,
 *          Promise.resolve(3) ]
 * 输出： 全部成功后 resolve -> [1, 2, 3]   （顺序和输入一致，不是谁先完成谁先排）
 */

function promiseAll() {
}

// —— 自测 ——
promiseAll([
  Promise.resolve(1),
  new Promise((r) => setTimeout(() => r(2), 100)),
  Promise.resolve(3),
]).then((res) => console.log(res)); // [1, 2, 3]

module.exports = { promiseAll };
