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
 * ——— 延伸 ———
 * - 指数退避：delay * 2^n，服务挂了别用固定间隔猛打。
 * - 可取消：重试前看 AbortSignal，清掉等待的 timer。
 * - 只对 5xx / 网络错误重试，4xx 没必要。
 * - times 要说清：这份是「失败后再试 times 次」，总共最多 times+1 次。
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

// —— 自测 ——
let count = 0;
const flaky = () =>
  new Promise((resolve, reject) => {
    count++;
    count < 3 ? reject(new Error('fail ' + count)) : resolve('ok');
  });

retry(flaky, 3, 10).then((res) => console.log(res)); // ok

module.exports = { retry };
