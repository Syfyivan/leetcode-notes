/**
 * 函数缓存 memoize
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 memoize(fn, resolver?)，缓存 fn 的计算结果：
 *   - 相同入参第二次调用时直接返回缓存，不再执行 fn；
 *   - 缓存 key 默认取第一个参数，可用 resolver 自定义（如 JSON.stringify(args)）。
 *
 * 思路：
 * 1. 闭包里放一张 Map，同样的 key 第二次直接拿结果。
 * 2. 默认拿第一个参数当 key。传了 resolver 就用它算 key。
 * 3. 对象当 key 按引用比。多参一般自己 JSON.stringify。
 *
 * ——— 示例 ———
 * let calls = 0;
 * const slow = (n) => { calls++; return n * n; };
 * const fast = memoize(slow);
 * 输入： fast(4); fast(4);
 * 输出： 两次都返回 16，但 slow 只真正执行 1 次（calls === 1）
 */

function memoize(fn, resolver) {
  const cache = new Map();
  return function (...args) {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) return cache.get(key);
    const val = fn.apply(this, args);
    cache.set(key, val);
    return val;
  };
}

// —— 自测 ——
let calls = 0;
const slow = (n) => { calls++; return n * n; };
const fast = memoize(slow);
console.log(fast(4)); // 16
console.log(fast(4)); // 16
console.log(calls);   // 1

module.exports = { memoize };
