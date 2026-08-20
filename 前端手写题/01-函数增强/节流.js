/**
 * 节流 throttle
 *
 * 需求：事件被频繁触发时，每隔 interval 毫秒最多执行一次。
 * 典型场景：滚动加载、按钮防连点。
 *
 * ——— 示例 ———
 * 输入： 每 50ms 触发一次，持续触发
 * 输出： 每 interval(=300ms) 才真正执行一次
 */

function throttle() {
}

// —— 自测（实现后每 300ms 打印一次；观察几秒后手动结束）——
const log = throttle((x) => console.log('run', x), 300);
let n = 0;
const timer = setInterval(() => {
  log(Date.now());
  if (++n > 40) clearInterval(timer); // 跑 2 秒自动停
}, 50);

module.exports = { throttle };
