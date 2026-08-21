/**
 * 异步串行执行 runSerial
 *
 * 优先级：前端 P2 · 全栈 P1
 *
 * 需求：实现 runSerial(tasks)，tasks 是一组返回 Promise 的函数：
 *   - 严格按顺序执行，前一个 resolve 后才启动下一个；
 *   - 返回一个 Promise，resolve 出按顺序排列的结果数组。
 *   和 Promise.all 的"并发"相对，这是"串行"，常用于有依赖的接口链。
 *
 * ——— 示例 ———
 * 输入： [ () => 延迟30ms后 resolve(1),
 *          () => 延迟10ms后 resolve(2),
 *          () => resolve(3) ]
 * 输出： 依次执行后 resolve -> [1, 2, 3]
 */

function runSerial() {
}

// —— 自测 ——
const delay = (v, ms) => () => new Promise((r) => setTimeout(() => r(v), ms));
runSerial([delay(1, 30), delay(2, 10), delay(3, 0)]).then((res) =>
  console.log(res)
); // [1, 2, 3]

module.exports = { runSerial };
