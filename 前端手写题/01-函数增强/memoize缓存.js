/**
 * 函数缓存 memoize
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 memoize(fn, resolver?)，缓存 fn 的计算结果：
 *   - 相同入参第二次调用时直接返回缓存，不再执行 fn；
 *   - 缓存 key 默认取第一个参数，可用 resolver 自定义（如 JSON.stringify(args)）。
 *
 * ——— 示例 ———
 * let calls = 0;
 * const slow = (n) => { calls++; return n * n; };
 * const fast = memoize(slow);
 * 输入： fast(4); fast(4);
 * 输出： 两次都返回 16，但 slow 只真正执行 1 次（calls === 1）
 */

function memoize() {
}

// —— 自测 ——
let calls = 0;
const slow = (n) => { calls++; return n * n; };
const fast = memoize(slow);
console.log(fast(4)); // 16
console.log(fast(4)); // 16
console.log(calls);   // 1

module.exports = { memoize };
