/**
 * 防抖 debounce
 *
 * 优先级：前端 P0 · 全栈 P1
 *
 * 需求：事件被频繁触发时，只在"停止触发 delay 毫秒后"才真正执行一次。
 * 典型场景：搜索框输入联想、窗口 resize。
 *
 * 思路：
 * 1. 每次触发先清掉上一个 timer，重新计时。
 * 2. 停够 delay 才真正跑，所以只执行最后一次。
 * 3. 闭包里把 this / args 存下来，定时器回调会丢 this。
 *
 * ——— 示例 ———
 * 输入： 连续快速调用 3 次（间隔 < delay）
 *        log(1); log(2); log(3);
 * 输出： 只在最后一次之后 delay 毫秒执行一次 -> run 3
 *
 * ——— 常见追问 ———
 * Q: 防抖和节流差在哪？
 * A: 防抖等你停手。节流是每隔 interval 最多一次，滚动加载用节流，搜索联想用防抖。
 *    防抖可能一直不执行（你一直输入）；节流保证过程中会定期响。
 *
 * Q: 为什么要用 apply 把 this 传回去？
 * A: 包装函数当事件监听时 this 是 DOM。setTimeout 回调里的 this 是 window / undefined。
 *    不存 ctx，fn 里的 this.value 就拿不到输入框。
 *
 * Q: 闭包里的 timer 会不会泄漏？
 * A: 下一次触发会 clearTimeout。真正要担心的是组件卸了，最后一次定时器还在。
 *    所以延伸 2 才有 cancel，卸载时清掉。
 *
 * Q: 箭头函数包一层行不行？
 * A: 外层必须是普通函数，才能拿到调用时的 this。内层 setTimeout 用箭头，
 *    正好吃外层存下来的 ctx / args。两个都写成箭头，this 会丢。
 */

function debounce(fn, delay) {
  let timer = null;
  function wrapped(...args) {
    const ctx = this; // 普通函数才能拿到 addEventListener 传进来的 this
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(ctx, args), delay);
  }
  wrapped.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };
  wrapped.flush = function () {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    // flush 用的是最后一次调用留下的 ctx / args，见延伸 2
  };
  return wrapped;
}

/**
 * 延伸 1：立即执行 debounceImmediate（leading）
 *
 * 需求：第一次触发立刻执行；之后 delay 内的触发全部丢掉。
 *       停够 delay 再重新武装，下一次又是「第一次」。
 * 典型场景：点搜索立刻出结果，但不能连点刷接口。
 *
 * 思路：
 * 1. timer 为空 = 没在冷却，这次算 first，立刻跑 fn。
 * 2. 不管是不是 first，都重新设一个 delay 后把 timer 置空的定时器。
 * 3. timer 置空 = 冷却结束，下次又能立刻跑。
 *
 * ——— 示例 ———
 * 输入： delay=300
 *        0ms  log(1)
 *        50ms log(2)
 *        80ms log(3)
 *        400ms log(4)   （距上次已超过 300ms，冷却结束）
 * 输出： 0ms 立刻 run 1；2、3 丢掉；400ms 立刻 run 4
 */
function debounceImmediate(fn, delay) {
  let timer = null;
  return function (...args) {
    const ctx = this;
    const first = !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null; // 冷却结束，下次又是 first
    }, delay);
    if (first) fn.apply(ctx, args);
  };
}

/**
 * 延伸 2：cancel / flush
 *
 * 需求：包装函数要能两件事：
 *   cancel：把还没执行的那次扔掉，之后不再触发。
 *   flush：别再等了，立刻把待执行的那次跑掉。
 * 典型场景：组件卸载时 cancel，免得 setState 打在已经卸掉的组件上；
 *           点提交时 flush，输入框里最后几个字别丢。
 *
 * 思路：
 * 1. 每次调用把 ctx / args 记到闭包里，flush 才能知道「要跑的是哪一次」。
 * 2. cancel：clearTimeout + 清空 timer，不调用 fn。
 * 3. flush：有 timer 才跑；跑完清 timer，避免 delay 到点又跑一次。
 *
 * ——— 示例 ———
 * 输入 A： delay=300
 *          0ms   log(1)
 *          100ms cancel()
 * 输出 A： 什么都不打印（待执行的 1 被扔掉）
 *
 * 输入 B： delay=300
 *          0ms   log(1); log(2)
 *          100ms flush()
 * 输出 B： 100ms 立刻 run 2；300ms 时不会再打一次
 */
function debounceWithCancel(fn, delay) {
  let timer = null;
  let lastCtx = null;
  let lastArgs = null;

  function wrapped(...args) {
    lastCtx = this;
    lastArgs = args;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(lastCtx, lastArgs);
    }, delay);
  }

  wrapped.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };

  wrapped.flush = function () {
    if (!timer) return; // 没有挂起的调用，flush 是空操作
    clearTimeout(timer);
    timer = null;
    fn.apply(lastCtx, lastArgs);
  };

  return wrapped;
}

/**
 * 延伸 3：maxWait（防抖 + 节流缝合）
 *
 * 需求：还是「停手 delay 毫秒后执行」，但如果一直不停地触发，
 *       也必须在 maxWait 毫秒内强制执行一次，不能无限推迟。
 * 典型场景：输入联想用防抖，但用户按住不放一直输入时，
 *           过 1 秒也得给一次建议，别一直白屏。lodash.debounce 就有这个选项。
 *
 * 思路：
 * 1. 普通 trailing 照旧：每次触发重置 delay 定时器。
 * 2. 另记一个窗口起点 firstTime。这次如果距 firstTime >= maxWait，立刻跑，并重开窗口。
 * 3. 真正执行一次之后，把 firstTime 清掉，下一轮重新计 maxWait。
 *
 * ——— 示例 ———
 * 输入： delay=300, maxWait=1000
 *        0ms、200ms、400ms、600ms、800ms 各调一次（一直没停够 300ms）
 * 输出： 普通防抖一次都不会跑；有 maxWait 时，约 1000ms 处强制 run 最后一次的参数
 *        之后如果停手，还会按 delay 再 trailing 一次（看实现是否在强制执行时清掉 trailing）
 *
 * 下面这份强制执行时清掉 trailing，所以不停输入时只靠 maxWait 出结果。
 */
function debounceMaxWait(fn, delay, maxWait) {
  let timer = null;
  let firstTime = 0;
  let lastCtx = null;
  let lastArgs = null;

  function invoke() {
    timer = null;
    firstTime = 0;
    fn.apply(lastCtx, lastArgs);
  }

  return function (...args) {
    lastCtx = this;
    lastArgs = args;
    const now = Date.now();
    if (!firstTime) firstTime = now;

    clearTimeout(timer);
    if (now - firstTime >= maxWait) {
      invoke(); // 拖太久了，不等 delay
      return;
    }
    timer = setTimeout(invoke, delay);
  };
}

// —— 自测（基础版应只打印一次 run 3）——
const log = debounce((x) => console.log('run', x), 300);
log(1); log(2); log(3);

module.exports = {
  debounce,
  debounceImmediate,
  debounceWithCancel,
  debounceMaxWait,
};
