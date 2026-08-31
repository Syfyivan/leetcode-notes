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

/**
 * 延伸 1：尾部执行 throttleTrailing
 *
 * 需求：第一次触发不立刻执行。一个时间窗内不管触发多少次，只在窗口末尾执行最后一次。
 * 典型场景：滚动停止前至少再更新一次位置，不能丢掉窗口里的最后一个坐标。
 *
 * 思路：
 * 1. timer 存在说明当前窗口已安排任务，直接更新 lastCtx / lastArgs。
 * 2. timer 不存在时安排 interval 后执行。
 * 3. 到点使用最后一次参数，并把 timer 清空，允许下一窗口重新排队。
 *
 * ——— 示例 ———
 * 输入：0ms、50ms、100ms 连续传入 1、2、3，interval=300
 * 输出：约 300ms 执行一次，参数是 3
 */
function throttleTrailing(fn, interval) {
  let timer = null;
  let lastCtx = null;
  let lastArgs = null;

  return function (...args) {
    lastCtx = this;
    lastArgs = args;
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      fn.apply(lastCtx, lastArgs);
    }, interval);
  };
}

/**
 * 延伸 2：leading / trailing / cancel / flush
 *
 * 需求：用 options 控制窗口开头和末尾是否执行，并提供 cancel、flush。
 * 默认 leading、trailing 都开启，行为与 lodash 的常用配置一致。
 *
 * 思路：
 * 1. previous 记录上次执行时间，remaining 算本窗口还剩多久。
 * 2. 窗口外且允许 leading 就立刻执行；窗口内且允许 trailing 就只留一个定时器。
 * 3. cancel 清掉全部状态；flush 立即执行仍在等待的尾调用。
 *
 * ——— 示例 ———
 * 输入：throttleWithOptions(fn, 300, { leading: false, trailing: true })
 * 输出：窗口开头不执行，约 300ms 后使用最后一次参数执行
 */
function throttleWithOptions(fn, interval, options = {}) {
  const leading = options.leading !== false;
  const trailing = options.trailing !== false;
  let timer = null;
  let previous = 0;
  let lastCtx = null;
  let lastArgs = null;

  function invoke(time) {
    previous = leading ? time : 0;
    timer = null;
    const ctx = lastCtx;
    const args = lastArgs;
    lastCtx = null;
    lastArgs = null;
    return fn.apply(ctx, args);
  }

  function wrapped(...args) {
    if (!leading && !trailing) return undefined;
    const now = Date.now();
    if (!previous && !leading) previous = now;
    const remaining = interval - (now - previous);
    lastCtx = this;
    lastArgs = args;

    if (remaining <= 0 || remaining > interval) {
      if (timer) clearTimeout(timer);
      return invoke(now);
    }
    if (!timer && trailing) {
      timer = setTimeout(() => invoke(Date.now()), remaining);
    }
  }

  wrapped.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    previous = 0;
    lastCtx = null;
    lastArgs = null;
  };

  wrapped.flush = function () {
    if (!timer) return undefined;
    clearTimeout(timer);
    return invoke(Date.now());
  };

  return wrapped;
}

// —— 自测（实现后每 300ms 打印一次；观察几秒后手动结束）——
const log = throttle((x) => console.log('run', x), 300);
let n = 0;
const timer = setInterval(() => {
  log(Date.now());
  if (++n > 40) clearInterval(timer); // 跑 2 秒自动停
}, 50);

module.exports = { throttle, throttleTrailing, throttleWithOptions };
