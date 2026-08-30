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
 *
 * ——— 延伸 ———
 * - 模块当单例：`export const store = new Store()`。ESM / CJS 都只求值一次，很多全局 Store 够用。
 * - 静态 getInstance：实例挂 Ctor 上，不包一层。外面能改 Ctor.instance，测试好重置、生产易被踩。
 * - 按 key 分实例（multiton）：Map 缓存，同一组参数共用一个，弹窗/连接池常用。
 *
 * ——— 常见追问 ———
 * Q: 后面几次 new 传的参数去哪了？
 * A: 丢掉。只有第一次走 new Ctor(...args)，之后直接吐旧实例。
 *
 * Q: 为什么包一层，不改原构造函数？
 * A: 原 Ctor 还能被单独 new，单例就破了。包装后只有走 SingleStore 才保证同一个。
 *
 * Q: new 一个普通函数，里面 return 对象会怎样？
 * A: 规范：构造函数返回对象就用这个对象；返回原始值则忽略，仍用新创建的 this。
 *    所以 `return instance` 能挡住多次 new。
 *
 * Q: 用 Ctor._instance 挂属性行不行？
 * A: 行，但外面能改掉。闭包变量摸不到。测试若要重置，闭包里再暴露一个 reset。
 */

function singleton(Ctor) {
  let instance; // 闭包里藏着，外面改不了
  return function (...args) {
    if (!instance) instance = new Ctor(...args); // 只第一次真正构造
    return instance; // new 碰到对象返回值，就用它当结果
  };
}

// —— 自测 ——
class Store { constructor() { this.id = Math.random(); } }
const SingleStore = singleton(Store);
const a = new SingleStore();
const b = new SingleStore();
console.log(a === b); // true

module.exports = { singleton };
