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

/**
 * 延伸 1：TTL 过期缓存
 *
 * 需求：结果只在 ttl 毫秒内有效。过期后的第一次调用重新计算，并刷新过期时间。
 * 典型场景：缓存接口配置或权限信息，既省重复请求，也不能永远返回旧数据。
 *
 * 思路：
 * 1. Map 的值不只存结果，还存 expiresAt。
 * 2. 命中时先看当前时间。未过期直接返回，过期就删掉再算。
 * 3. 把 cache 和 clear 暴露在包装函数上，调用方可主动失效。
 *
 * ——— 示例 ———
 * 输入： const get = memoizeWithTTL(x => x * 2, 1000); get(2); get(2)
 * 输出： 一秒内两次都返回 4，原函数只执行一次
 */
function memoizeWithTTL(fn, ttl, resolver) {
  const cache = new Map();

  function memoized(...args) {
    const key = resolver ? resolver(...args) : args[0];
    const entry = cache.get(key);
    if (entry && entry.expiresAt > Date.now()) return entry.value;
    if (entry) cache.delete(key);

    const value = fn.apply(this, args);
    cache.set(key, { value, expiresAt: Date.now() + ttl });
    return value;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  return memoized;
}

/**
 * 延伸 2：限制容量的 LRU 缓存
 *
 * 需求：最多保留 maxSize 条。缓存满后加入新 key，要淘汰最久没被使用的那条。
 *
 * 思路：
 * 1. Map 会保留插入顺序，最前面的 key 就是最久没碰的。
 * 2. 每次命中先 delete 再 set，把它挪到队尾。
 * 3. 超过上限时删除 cache.keys().next().value。
 *
 * ——— 示例 ———
 * 输入：容量 2，依次调用 a、b、a、c
 * 输出：b 被淘汰；a 因刚命中过而留下
 */
function memoizeLRU(fn, maxSize = 100, resolver) {
  if (!Number.isInteger(maxSize) || maxSize < 1) {
    throw new RangeError('maxSize 必须是正整数');
  }
  const cache = new Map();

  function memoized(...args) {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const value = fn.apply(this, args);
    cache.set(key, value);
    if (cache.size > maxSize) cache.delete(cache.keys().next().value);
    return value;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  return memoized;
}

// —— 自测 ——
let calls = 0;
const slow = (n) => { calls++; return n * n; };
const fast = memoize(slow);
console.log(fast(4)); // 16
console.log(fast(4)); // 16
console.log(calls);   // 1

module.exports = { memoize, memoizeWithTTL, memoizeLRU };
