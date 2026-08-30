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
 *
 * ——— 延伸 ———
 * - 缓存会无限涨。真用要 LRU 或 TTL；组件卸载记得清，别把过期结果一直握着。
 * - WeakMap：对象当 key 且允许被 GC。resolver 一旦 stringify 成字符串，WeakMap 就用不上。
 * - 递归函数要在定义里就走缓存（斐波那契内部调 memoFib），外层包一层包不到里面那次。
 * - JSON.stringify 当 key：键顺序敏感，循环引用会炸。对象默认按引用比，两个 {} 是两次计算。
 *
 * ——— 常见追问 ———
 * Q: 为什么默认只拿第一个参数当 key？
 * A: lodash 同款。多数场景就一个参数。多参自己传 resolver，常见是 JSON.stringify(args)。
 *
 * Q: 为什么用 Map 不用普通对象？
 * A: 对象当 key 会被 toString 成 "[object Object]"，全撞在一起。Map 按引用比。
 *
 * Q: 为什么用 cache.has 不用 get 之后判空？
 * A: 合法结果可以是 0 / false / undefined / null。has 才能区分「没算过」和「算过就是空」。
 *
 * Q: this 为什么要用 apply 传回去？
 * A: obj.method 被 memoize 后还可能靠 this 取字段。丢掉就变成 window / undefined。
 *
 * Q: 缓存会不会内存泄漏？
 * A: 会，key 一直进 Map 就不出来。要上限就上 LRU；对象 key 且不需枚举可以用 WeakMap。
 */

function memoize(fn, resolver) {
  const cache = new Map();
  return function (...args) {
    const key = resolver ? resolver(...args) : args[0]; // 默认单参；对象按引用当 key
    if (cache.has(key)) return cache.get(key); // 结果可能是 undefined，不能用 get 判空
    const val = fn.apply(this, args); // 当方法调时保住 this
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
