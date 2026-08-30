/**
 * 寄生组合式继承
 *
 * 优先级：前端 P1 · 全栈 P2
 *
 * 需求：用 ES5 方式实现 inherit(Child, Parent)，达到最优继承：
 *   - 子类实例能访问父类属性和方法；
 *   - 父类构造函数只调用一次（避免组合继承的两次调用）；
 *   - 用 Object.create 断开原型共享，并修复 Child.prototype.constructor。
 *   这是 class extends 的底层原理，面试常要求"手写 extends"。
 *
 * 思路：
 * 1. Child.prototype = Object.create(Parent.prototype)，只接原型，不跑父构造函数。
 * 2. 再把 constructor 改回 Child，不然会指到 Parent。
 * 3. 实例属性仍由 Child 里 Parent.call(this) 负责，父构造只跑一次。
 * 4. 边界 / 易错：写成 Child.prototype = new Parent() 会多跑一次构造，还可能带上多余属性。
 *
 * ——— 示例 ———
 * function Animal(name) { this.name = name; }
 * Animal.prototype.say = function () { return 'I am ' + this.name; };
 * function Dog(name) { Animal.call(this, name); }
 * inherit(Dog, Animal);
 * 输入： new Dog('旺财').say()
 * 输出： 'I am 旺财'
 *
 * ——— 延伸 ———
 * - 静态方法：Object.setPrototypeOf(Child, Parent)，Child.create 才能摸到 Parent.create。
 * - class Child extends Parent：底层就是 inherit + constructor 里 super()（即 Parent.call(this)）。
 * - 组合继承：Child.prototype = new Parent()，父构造跑两次，原型上还会多一份无用的实例字段。
 *
 * ——— 常见追问 ———
 * Q: 为什么不用 new Parent() 接原型？
 * A: new 会跑父构造。父类若依赖参数，这一下就炸；还会把实例属性混进原型，子类们共享一份。
 *
 * Q: constructor 为什么要改回来？
 * A: Object.create 之后 Child.prototype.constructor 指向 Parent。
 *    有人用 instance.constructor 做工厂时会 new 错人。
 *
 * Q: Parent.call(this) 放哪？
 * A: 放子构造函数里。inherit 只接原型方法，实例字段还得 call 一次写到 this 上。
 *
 * Q: instanceof 为什么还能对上？
 * A: instanceof 沿 __proto__ 找。Child.prototype 的原型是 Parent.prototype，链是通的。
 */

function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype); // 只借原型，不跑父构造
  Child.prototype.constructor = Child; // create 之后 constructor 指到了 Parent
}

// —— 自测 ——
function Animal(name) { this.name = name; }
Animal.prototype.say = function () { return 'I am ' + this.name; };
function Dog(name) { Animal.call(this, name); }
inherit(Dog, Animal);

const d = new Dog('旺财');
console.log(d.say());                 // I am 旺财
console.log(d instanceof Animal);     // true
console.log(Dog.prototype.constructor === Dog); // true

module.exports = { inherit };
