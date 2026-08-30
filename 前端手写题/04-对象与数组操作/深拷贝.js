/**
 * 深拷贝
 *
 * 优先级：前端 P0 · 全栈 P0
 *
 * 输入：任意值（对象 / 数组 / 原始值，可能存在循环引用）。
 * 输出：一份完全独立的深拷贝，改动拷贝不影响原对象。
 *
 * 思路：
 * 1. 原始值和 null 直接返回。对象先查 WeakMap，见过就返回上次那份拷贝，切断循环。
 * 2. Date / RegExp / Map / Set 各自 new 一份，再拷里面的内容。
 * 3. 普通对象和数组：先建空壳放进 WeakMap，再逐个键递归。空壳要先放，自引用才能绕回来。
 * 4. 边界 / 易错：WeakMap 的 key 必须是对象；函数不拷，原样返回。
 *
 * ——— 示例 ———
 * 输入： const a = { a: 1, b: { c: 2 }, d: [3, 4] };
 *        const b = 深拷贝(a);  b.b.c = 999;
 * 输出： a.b.c === 2      // 原对象不受影响
 *        b.b.c === 999
 *
 * 进阶（循环引用）：
 * 输入： const o = { name: 'self' };  o.self = o;
 * 输出： 深拷贝(o).self.name === 'self'   // 不能爆栈
 */

function deepClone(value, cache = new WeakMap()) {
  if (typeof value !== 'object' || value === null) return value;
  if (cache.has(value)) return cache.get(value);

  if (value instanceof Date) {
    const cloned = new Date(value.getTime());
    cache.set(value, cloned);
    return cloned;
  }
  if (value instanceof RegExp) {
    const cloned = new RegExp(value.source, value.flags);
    cache.set(value, cloned);
    return cloned;
  }
  if (value instanceof Map) {
    const cloned = new Map();
    cache.set(value, cloned);
    value.forEach((v, k) => {
      cloned.set(deepClone(k, cache), deepClone(v, cache));
    });
    return cloned;
  }
  if (value instanceof Set) {
    const cloned = new Set();
    cache.set(value, cloned);
    value.forEach((v) => {
      cloned.add(deepClone(v, cache));
    });
    return cloned;
  }

  const cloned = Array.isArray(value) ? [] : {};
  cache.set(value, cloned); // 先入缓存，循环引用回来时能命中
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i++) {
    cloned[keys[i]] = deepClone(value[keys[i]], cache);
  }
  return cloned;
}

// —— 自测（实现前跑会报错，实现后应逐行打印期望值）——
const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
const copy = deepClone(obj);
copy.b.c = 999;
console.log(obj.b.c);  // 2
console.log(copy.b.c); // 999

const cyclic = { name: 'self' };
cyclic.self = cyclic;
console.log(deepClone(cyclic).self.name); // 'self'

module.exports = { deepClone };
