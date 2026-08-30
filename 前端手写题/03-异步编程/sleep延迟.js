/**
 * sleep 延迟函数
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 sleep(ms)，返回一个 ms 毫秒后 resolve 的 Promise，
 *       配合 async/await 做异步等待。
 *
 * 思路：
 * 1. 返回一个 Promise，ms 后 resolve。
 * 2. setTimeout 包一层 resolve 就够了。
 * 3. 没有拒绝路径。
 *
 * ——— 示例 ———
 * 输入：
 *   async function run() {
 *     console.log('start');
 *     await sleep(100);
 *     console.log('end');   // 约 100ms 后打印
 *   }
 * 输出： 先 start，约 100ms 后 end
 *
 * ——— 延伸 ———
 * - 可取消：记下 timer，abort 时 clearTimeout 再 reject。AbortSignal 同款。
 * - 顺手带值：sleep(ms, value) 到点 resolve 那个值，少包一层。
 * - 和 lodash.delay / 面试里的 delay 是同一件事。
 *
 * ——— 常见追问 ———
 * Q: 为什么不用 while (Date.now() < t) 空转？
 * A: 空转卡死主线程。setTimeout 把控制权交回去，时间到了再唤醒。
 *
 * Q: sleep(0) 立刻跑吗？
 * A: 丢进宏任务队列。当前同步和微任务跑完才到，跟 setTimeout(0) 一样。
 *
 * Q: 能取消吗？
 * A: 这份不能。要取消就包 AbortSignal，abort 时清 timer 再 reject。
 *
 * Q: 为什么必须 new Promise？
 * A: setTimeout 返回的是 timer id，await 不了。要把 resolve 塞进回调里。
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms)); // await 的是 Promise，不是 timer id
}

// —— 自测 ——
(async () => {
  console.log('start');
  await sleep(100);
  console.log('end');
})();

module.exports = { sleep };
