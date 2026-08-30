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
 * ——— 延伸 ———
 * - 空可迭代：立刻 []。漏了这个会 pending 到死。
 * - 和 allSettled：all 一个失败就整单失败；allSettled 等全部落定再交卷。
 * - 超时：每个再 race 一个 sleep reject，避免某条一直挂着。
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

// —— 自测 ——
promiseAll([
  Promise.resolve(1),
  new Promise((r) => setTimeout(() => r(2), 100)),
  Promise.resolve(3),
]).then((res) => console.log(res)); // [1, 2, 3]

module.exports = { promiseAll };
