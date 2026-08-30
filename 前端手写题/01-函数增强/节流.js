/**
 * 节流 throttle
 *
 * 优先级：前端 P0 · 全栈 P1
 *
 * 需求：事件被频繁触发时，每隔 interval 毫秒最多执行一次。
 * 典型场景：滚动加载、按钮防连点。
 *
 * 思路：
 * 1. 记下上次真正执行的时间戳。
 * 2. 距上次不足 interval 就丢掉这次。
 * 3. 第一次立刻执行。this / args 用 apply 带过去。
 *
 * ——— 示例 ———
 * 输入： 每 50ms 触发一次，持续触发
 * 输出： 每 interval(=300ms) 才真正执行一次
 *
 * ——— 延伸 ———
 * - trailing：窗口内最后一次被丢掉的，到点再补一刀。滚动停了也要刷一次布局，就靠它。
 * - leading: false：开头不跑，只在窗口末尾跑。和 trailing 一起才是「延后执行的节流」。
 * - lodash 默认 leading + trailing 都开：头一次立刻，窗口里的最后一次再补。
 * - cancel / flush：和防抖一样，组件卸载要清；提交前可以把压着的那次立刻跑掉。
 *
 * ——— 常见追问 ———
 * Q: 防抖和节流差在哪？
 * A: 防抖等你停手。节流每隔 interval 最多一次。滚动加载用节流，搜索联想用防抖。
 *
 * Q: 这份是 leading 还是 trailing？
 * A: leading。第一次立刻跑，窗口内的丢掉。停手时如果还在窗口内，最后一次不会补。
 *
 * Q: 为什么第一次能立刻执行？
 * A: last 初值是 0，now - 0 一定大于 interval。想开头也等，把 last 设成 Date.now()。
 *
 * Q: 时间戳和定时器两种实现差在哪？
 * A: 时间戳（这份）是 leading。定时器是 trailing，到点才跑。两边都要就两个都记。
 *
 * Q: 按钮防连点用哪个？
 * A: 节流。点下去立刻提交，interval 内再点丢掉。防抖会等到停手才提交，按钮不合适。
 */

function throttle(fn, interval) {
  let last = 0; // 0 让第一次 now - last 必过间隔
  return function (...args) {
    const now = Date.now();
    if (now - last < interval) return;
    last = now; // 先记时间，避免 fn 里重入又立刻跑一次
    fn.apply(this, args); // 滚动监听 this 是 DOM
  };
}

// —— 自测（实现后每 300ms 打印一次；观察几秒后手动结束）——
const log = throttle((x) => console.log('run', x), 300);
let n = 0;
const timer = setInterval(() => {
  log(Date.now());
  if (++n > 40) clearInterval(timer); // 跑 2 秒自动停
}, 50);

module.exports = { throttle };
