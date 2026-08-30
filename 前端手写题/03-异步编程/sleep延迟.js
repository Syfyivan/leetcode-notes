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
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// —— 自测 ——
(async () => {
  console.log('start');
  await sleep(100);
  console.log('end');
})();

module.exports = { sleep };
