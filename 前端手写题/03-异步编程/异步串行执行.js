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
 * 思路：
 * 1. for 循环里 await 每一个任务，前一个结束才启动下一个。
 * 2. 结果按顺序推进数组。
 * 3. 中途 reject 会直接抛出去，后面的不再跑。
 *
 * ——— 示例 ———
 * 输入： [ () => 延迟30ms后 resolve(1),
 *          () => 延迟10ms后 resolve(2),
 *          () => resolve(3) ]
 * 输出： 依次执行后 resolve -> [1, 2, 3]
 *
 * ——— 延伸 ———
 * - reduce 版：累加器是 Promise，每次 then 再跑下一个。不写 async 也能串。
 * - 中途失败继续：catch 后 push 个标记，类似串行的 allSettled。
 * - 管道：后一个函数吃前一个的返回值，有依赖时比独立任务更常见。
 *
 * ——— 常见追问 ———
 * Q: 和 Promise.all 差在哪？
 * A: all 一起发，总耗时约等于最慢那个。serial 一个接一个，总耗时是求和。
 *    有先后依赖才用串行。
 *
 * Q: forEach + await 为什么不行？
 * A: forEach 不等回调。三个 task() 会被同步全部启动，又变并发了。
 *
 * Q: 能用 reduce 吗？
 * A: 能。p.then(() => t()) 把下一个接到前一个后面。不写 async 的面试常考这个。
 *
 * Q: 中途 reject 后面的还跑吗？
 * A: 不跑。await 抛错直接出函数。要跑完就自己 try/catch。
 */

async function runSerial(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task()); // 前一个结束才调用下一个；forEach 里 await 挡不住
  }
  return results;
}

// —— 自测 ——
const delay = (v, ms) => () => new Promise((r) => setTimeout(() => r(v), ms));
runSerial([delay(1, 30), delay(2, 10), delay(3, 0)]).then((res) =>
  console.log(res)
); // [1, 2, 3]

module.exports = { runSerial };
