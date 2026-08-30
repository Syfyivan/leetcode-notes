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
 */

function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
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
