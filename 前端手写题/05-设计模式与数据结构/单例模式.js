/**
 * 单例模式 singleton
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 singleton(Ctor)，包装一个构造函数，使其无论 new 多少次
 *       都只返回同一个实例。常用于全局弹窗、Store、连接池。
 *
 * ——— 示例 ———
 * class Store { constructor() { this.id = Math.random(); } }
 * const SingleStore = singleton(Store);
 * 输入： new SingleStore() === new SingleStore()
 * 输出： true（两次拿到同一个实例）
 */

function singleton() {
}

// —— 自测 ——
class Store { constructor() { this.id = Math.random(); } }
const SingleStore = singleton(Store);
const a = new SingleStore();
const b = new SingleStore();
console.log(a === b); // true

module.exports = { singleton };
