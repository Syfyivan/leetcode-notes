/**
 * 手写 instanceof
 *
 * 优先级：前端 P1 · 全栈 P2
 *
 * 需求：实现 myInstanceof(obj, Ctor)，判断 Ctor.prototype 是否
 *       出现在 obj 的原型链上。基本类型直接返回 false。
 *
 * 思路：
 * 1. 从 obj 的原型一路往上找，碰到 Ctor.prototype 就是 true。
 * 2. 基本类型、null 没有可走的链，直接 false。
 * 3. 用 Object.getPrototypeOf，走到 null 就停。
 *
 * ——— 示例 ———
 * 输入： myInstanceof([], Array)
 * 输出： true
 *
 * 输入： myInstanceof([], Object)
 * 输出： true       （Array 继承自 Object）
 *
 * 输入： myInstanceof(1, Number)
 * 输出： false      （基本类型不在原型链上）
 */

function myInstanceof(obj, Ctor) {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false;
  }
  const prototype = Ctor.prototype;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// —— 自测 ——
console.log(myInstanceof([], Array));  // true
console.log(myInstanceof([], Object)); // true
console.log(myInstanceof(1, Number));  // false

module.exports = { myInstanceof };
