/**
 * 防抖 debounce
 *
 * 需求：事件被频繁触发时，只在"停止触发 delay 毫秒后"才真正执行一次。
 * 典型场景：搜索框输入联想、窗口 resize。
 *
 * ——— 示例 ———
 * 输入： 连续快速调用 3 次（间隔 < delay）
 *        log(1); log(2); log(3);
 * 输出： 只在最后一次之后 delay 毫秒执行一次 -> run 3
 */

function debounce() {
}

// —— 自测（实现后应只打印一次 run 3）——
const log = debounce((x) => console.log('run', x), 300);
log(1); log(2); log(3);

module.exports = { debounce };
