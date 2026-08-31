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

/**
 * 延伸 1：延迟后返回指定值
 *
 * 需求：sleep(ms, value) 到点后 resolve value，方便直接接在 Promise 链里。
 *
 * 思路：setTimeout 支持把额外参数传给回调，直接把 resolve 当回调即可。
 *
 * ——— 示例 ———
 * 输入：await sleepValue(100, 'done')
 * 输出：约 100ms 后得到 'done'
 */
function sleepValue(ms, value) {
  return new Promise((resolve) => setTimeout(resolve, ms, value));
}

/**
 * 延伸 2：使用 AbortSignal 取消等待
 *
 * 需求：signal 被 abort 时清掉定时器并 reject；如果调用前已经终止，立即 reject。
 * 典型场景：组件卸载、请求取消后，不再保留无意义的延迟任务。
 *
 * 思路：
 * 1. 同时监听 timer 和 signal，谁先发生谁负责落定 Promise。
 * 2. abort 分支 clearTimeout；正常完成分支移除 abort 监听。
 * 3. Promise 只能落定一次，但监听器仍要清理，避免多余引用。
 *
 * ——— 示例 ———
 * 输入：const c = new AbortController(); sleepAbortable(1000, c.signal); c.abort()
 * 输出：Promise 以 AbortError 拒绝
 */
function sleepAbortable(ms, signal) {
  return new Promise((resolve, reject) => {
    const abortError = () => {
      const error = new Error('等待已取消');
      error.name = 'AbortError';
      return error;
    };
    if (signal?.aborted) {
      reject(signal.reason || abortError());
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason || abortError());
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// —— 自测 ——
(async () => {
  console.log('start');
  await sleep(100);
  console.log('end');
})();

module.exports = { sleep, sleepValue, sleepAbortable };
