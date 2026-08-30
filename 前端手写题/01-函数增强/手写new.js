/**
 * 手写 new
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 需求：实现 myNew(Ctor, ...args)，复刻 new 的四步：
 *   1）创建一个新对象，原型指向 Ctor.prototype；
 *   2）以新对象为 this 执行构造函数；
 *   3）构造函数若返回对象就用它，否则返回新对象。
 *
 * 思路：
 * 1. Object.create 把新对象的原型接到 Ctor.prototype。
 * 2. apply 把 this 指过去执行构造函数。
 * 3. 构造函数返回对象或函数就用返回值，否则用新对象。
 *
 * ——— 示例 ———
 * function Person(name) { this.name = name; }
 * 输入： myNew(Person, '小明')
 * 输出： { name: '小明' }（且 instanceof Person 为 true）
 *
 * ——— 延伸 ———
 * - 构造函数 return 函数也算对象（function instanceof Object 为 true），会当返回值。
 * - 箭头函数不能 new：没有 prototype，Object.create(undefined) 会抛。
 * - new.target：原生构造函数里能读到当前是被 new 的。apply 调没有这个，类构造会因此拒绝。
 * - 和 Object.create 的分工：create 只接原型；new 还要跑构造函数，把属性写到实例上。
 *
 * ——— 常见追问 ———
 * Q: 为什么返回对象就不用新对象了？
 * A: 规范如此。工厂式构造函数可以 return 另一个对象。返回基本类型则忽略，仍用新对象。
 *
 * Q: null 算不算对象？
 * A: typeof null 是 'object'，但 null instanceof Object 为 false，所以走新对象。
 *
 * Q: Object.create 干了什么？
 * A: 建一个空对象，[[Prototype]] 指向 Ctor.prototype。实例才能访到原型上的方法。
 *
 * Q: 和直接 {} 再赋值 __proto__ 比呢？
 * A: {} 已经带了 Object.prototype，再改容易乱。create 一次设好，也避开 __proto__ 旧写法。
 *
 * Q: 箭头函数能 new 吗？
 * A: 不能。没有 prototype，Object.create(undefined) 会抛。
 */

function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype); // 一次设好原型，避开 __proto__ 旧写法
  const result = Ctor.apply(obj, args);
  // null instanceof Object 为 false，基本类型也会走 obj
  return result instanceof Object ? result : obj;
}

// —— 自测 ——
function Person(name) { this.name = name; }
const p = myNew(Person, '小明');
console.log(p.name);              // 小明
console.log(p instanceof Person); // true

module.exports = { myNew };
