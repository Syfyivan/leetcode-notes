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
 * ——— 示例 ———
 * function Animal(name) { this.name = name; }
 * Animal.prototype.say = function () { return 'I am ' + this.name; };
 * function Dog(name) { Animal.call(this, name); }
 * inherit(Dog, Animal);
 * 输入： new Dog('旺财').say()
 * 输出： 'I am 旺财'
 */

function inherit() {
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
