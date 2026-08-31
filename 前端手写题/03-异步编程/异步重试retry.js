/**
 * 异步重试 retry
 *
 * 优先级：前端 P2 · 全栈 P1
 *
 * 需求：实现 retry(fn, times, delay)：
 *   - fn 是返回 Promise 的异步函数；
 *   - 失败后最多再重试 times 次，每次间隔 delay 毫秒；
 *   - 任意一次成功就 resolve；耗尽次数仍失败则 reject 最后一次原因。
 *   接口请求失败自动重试是后端 / 全栈常见诉求。
 *
 * 思路：
 * 1. 先调一次 fn，成功就返回。
 * 2. 失败则等 delay，times 减 1 再调自己。
 * 3. times 耗尽还失败，把最后一次原因 reject 出去。
 *
 * ——— 示例 ———
 * 输入： 一个前两次 reject、第三次 resolve('ok') 的 fn
 *        retry(fn, 3, 10)
 * 输出： 最终 resolve -> 'ok'
 *
 * ——— 常见追问 ———
 * Q: times=3 一共调几次？
 * A: 最多 4 次。先调一次，失败再试 3 次。开口先问清包不包含第一次。
 *
 * Q: 为什么 catch 里要 return Promise.reject？
 * A: 不 return 的话这条链会变成成功，值是 undefined。调用方会走 then。
 *
 * Q: 成功了还会继续重试吗？
 * A: 不会。resolve 了就进不了 catch，值直接往外传。
 *
 * Q: 第一次之前等 delay 吗？
 * A: 不等。第一次立刻调，失败才睡。先睡再请求是另一回事。
 */

function retry(fn, times, delay) {
  return fn().catch((err) => {
    if (times <= 0) return Promise.reject(err); // 忘了 return，链会变成 resolve(undefined)
    return new Promise((r) => setTimeout(r, delay)).then(() =>
      retry(fn, times - 1, delay)
    );
  });
}

/**
 * 延伸 1：指数退避 + 错误筛选
 *
 * 需求：每次等待按 baseDelay * factor^attempt 增长，并用 shouldRetry 决定该错误是否值得重试。
 * 典型场景：网络错误和 5xx 可重试；参数错误、鉴权失败等 4xx 应直接交给调用方。
 *
 * 思路：
 * 1. attempt 从 0 开始，第一次请求仍然立刻发出。
 * 2. 失败后先检查次数和 shouldRetry，再等待本轮退避时间。
 * 3. maxDelay 给等待时间封顶，避免重试间隔无限增长。
 *
 * ——— 示例 ———
 * 输入：retries=3, baseDelay=100, factor=2
 * 输出：最多调用 4 次，三次重试前分别等待约 100、200、400ms
 */
async function retryWithOptions(fn, options = {}) {
  const {
    retries = 3,
    baseDelay = 100,
    factor = 2,
    maxDelay = Infinity,
    shouldRetry = () => true,
    signal,
  } = options;

  function abortError() {
    const error = new Error('重试已取消');
    error.name = 'AbortError';
    return error;
  }

  function wait(ms) {
    return new Promise((resolve, reject) => {
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

  for (let attempt = 0; ; attempt++) {
    if (signal?.aborted) throw signal.reason || abortError();
    try {
      return await fn(attempt, signal);
    } catch (error) {
      if (attempt >= retries || !shouldRetry(error, attempt)) throw error;
      const delay = Math.min(maxDelay, baseDelay * (factor ** attempt));
      await wait(delay);
    }
  }
}

/**
 * 延伸 2：加入随机抖动 jitter
 *
 * 需求：大量客户端同时失败时，不要在相同时间点一起重试。等待时间随机落在 0 到 delay 之间。
 *
 * 思路：复用 retryWithOptions，只把每轮 factor 退避改成 full jitter。
 * 这里通过包装 setTimeout 的基准参数展示公式，生产代码可把 random 注入以便测试。
 */
function retryWithJitter(fn, options = {}) {
  const {
    retries = 3,
    baseDelay = 100,
    factor = 2,
    maxDelay = Infinity,
    shouldRetry = () => true,
    random = Math.random,
    signal,
  } = options;

  const abortError = () => {
    const error = new Error('重试已取消');
    error.name = 'AbortError';
    return error;
  };
  const wait = (ms) => new Promise((resolve, reject) => {
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

  return (async () => {
    for (let attempt = 0; ; attempt++) {
      if (signal?.aborted) throw signal.reason || abortError();
      try {
        return await fn(attempt, signal);
      } catch (error) {
        if (attempt >= retries || !shouldRetry(error, attempt)) throw error;
        const cap = Math.min(maxDelay, baseDelay * (factor ** attempt));
        await wait(random() * cap);
      }
    }
  })();
}

// —— 自测 ——
let count = 0;
const flaky = () =>
  new Promise((resolve, reject) => {
    count++;
    count < 3 ? reject(new Error('fail ' + count)) : resolve('ok');
  });

retry(flaky, 3, 10).then((res) => console.log(res)); // ok

module.exports = { retry, retryWithOptions, retryWithJitter };
