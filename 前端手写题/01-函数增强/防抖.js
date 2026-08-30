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
 * ——— 延伸 ———
 * - immediate：第一次立刻执行，后面的触发在 delay 内都忽略，停够后再武装下一次。
 *   适合「点一下马上搜，但别连点」。trailing（默认）是停手才搜。
 * - cancel / flush：组件卸载要 cancel，免得 setState 在死组件上；flush 是立刻把
 *   待执行的那次跑掉（提交表单时常用）。
 * - maxWait：一直输入也强制隔一段时间跑一次，防抖 + 节流的缝合。lodash 就有。
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
 *    所以延伸里才有 cancel，卸载时清掉。
 *
 * Q: 箭头函数包一层行不行？
 * A: 外层必须是普通函数，才能拿到调用时的 this。内层 setTimeout 用箭头，
 *    正好吃外层存下来的 ctx / args。两个都写成箭头，this 会丢。
 */

function debounce(fn, delay) {
  let timer = null;
  function wrapped(...args) {
    const ctx = this; // 普通函数才能拿到 input.addEventListener 传进来的 this
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(ctx, args), delay);
  }
  wrapped.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };
  return wrapped;
}

// 延伸：第一次立刻执行，之后 delay 内的触发丢掉
function debounceImmediate(fn, delay) {
  let timer = null;
  return function (...args) {
    const ctx = this;
    const first = !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null; // 停够之后重新武装，下次又是 first
    }, delay);
    if (first) fn.apply(ctx, args);
  };
}

// —— 自测（实现后应只打印一次 run 3）——
const log = debounce((x) => console.log('run', x), 300);
log(1); log(2); log(3);

module.exports = { debounce, debounceImmediate };
