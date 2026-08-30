/**
 * 单例模式 singleton
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 singleton(Ctor)，包装一个构造函数，使其无论 new 多少次
 *       都只返回同一个实例。常用于全局弹窗、Store、连接池。
 *
 * 思路：
 * 1. 闭包里留一个 instance。返回的包装函数每次被 new，有实例就直接返回它。
 * 2. new 遇到函数返回对象时，会用这个对象当结果，所以能挡住多次 new。
 * 3. 边界 / 易错：实例要在包装函数里 new Ctor，不要在外面提前 new。
 *
 * ——— 示例 ———
 * class Store { constructor() { this.id = Math.random(); } }
 * const SingleStore = singleton(Store);
 * 输入： new SingleStore() === new SingleStore()
 * 输出： true（两次拿到同一个实例）
 */

function singleton(Ctor) {
  let instance;
  return function (...args) {
    if (!instance) instance = new Ctor(...args);
    return instance;
  };
}

// —— 自测 ——
class Store { constructor() { this.id = Math.random(); } }
const SingleStore = singleton(Store);
const a = new SingleStore();
const b = new SingleStore();
console.log(a === b); // true

module.exports = { singleton };
