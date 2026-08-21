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
 * ——— 示例 ———
 * function Person(name) { this.name = name; }
 * 输入： myNew(Person, '小明')
 * 输出： { name: '小明' }（且 instanceof Person 为 true）
 */

function myNew() {
}

// —— 自测 ——
function Person(name) { this.name = name; }
const p = myNew(Person, '小明');
console.log(p.name);              // 小明
console.log(p instanceof Person); // true

module.exports = { myNew };
