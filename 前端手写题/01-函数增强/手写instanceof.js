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
 *
 * ——— 延伸 ———
 * - Symbol.hasInstance：原生 instanceof 会先调这个，手写一般只走原型链。
 * - 跨 iframe：两边的 Array 不是同一个构造函数，instanceof 为 false，Array.isArray 能过。
 * - Object.create(null) 没有原型，永远 false。
 * - 右边必须能取出 prototype。原生遇到非对象会 TypeError。
 *
 * ——— 常见追问 ———
 * Q: 为什么 1 instanceof Number 是 false？
 * A: instanceof 只认对象。1 是基本类型，没有原型链。new Number(1) 才是 true。
 *
 * Q: 和 typeof 怎么分工？
 * A: typeof 分基本类型，对象一律 'object'（函数除外）。instanceof 沿原型链认构造函数。
 *
 * Q: 为什么用 Object.getPrototypeOf 不用 obj.__proto__？
 * A: __proto__ 是历史遗物，还可能被改掉。getPrototypeOf 读的是真正的 [[Prototype]]。
 *
 * Q: 右边不是函数怎么办？
 * A: 原生抛 TypeError。手写如果 Ctor.prototype 取不到也会出问题，面试提一句即可。
 *
 * Q: 原型链成环会怎样？
 * A: while 死循环。规范禁止成环，手写可加个 Set 记住走过的 proto。
 */

function myInstanceof(obj, Ctor) {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false; // 基本类型没有原型链；函数也是对象，得放行
  }
  const prototype = Ctor.prototype;
  let proto = Object.getPrototypeOf(obj);
  while (proto) { // Object.prototype 的原型是 null，到这就停
    if (proto === prototype) return true; // 必须同一引用，跨 iframe 的 Array 对不上
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// —— 自测 ——
console.log(myInstanceof([], Array));  // true
console.log(myInstanceof([], Object)); // true
console.log(myInstanceof(1, Number));  // false

module.exports = { myInstanceof };
