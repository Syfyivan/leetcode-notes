/**
 * 深拷贝
 *
 * 输入：任意值（对象 / 数组 / 原始值，可能存在循环引用）。
 * 输出：一份完全独立的深拷贝，改动拷贝不影响原对象。
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
  if(typeof value !== 'object' || value === null) return value;
  if(cache.has(value)) return cache.get(value)
  const res = Array.isArray(value) ? [] : {};
  for(const key in value) {
      cache.set(key, res)
      res[key] = deepClone(value[key], cache);
    }
  
  return res;
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
