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
 * ——— 示例 ———
 * 输入： 一个前两次 reject、第三次 resolve('ok') 的 fn
 *        retry(fn, 3, 10)
 * 输出： 最终 resolve -> 'ok'
 */

function retry() {
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
