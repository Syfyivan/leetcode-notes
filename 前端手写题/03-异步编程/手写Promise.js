/**
 * 手写 Promise（A+ 规范简化版）—— 压轴难题
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 需求：实现 MyPromise，覆盖 A+ 核心能力：
 *   - 三态 pending → fulfilled / rejected，一旦落定不可逆；
 *   - executor 里 resolve/reject 落定状态，抛错等价于 reject；
 *   - then(onFulfilled, onRejected) 返回新 Promise，支持链式调用；
 *   - then 回调必须异步执行（用 queueMicrotask 放进微任务队列）；
 *   - 值穿透：then 参数不是函数时透传上一个值 / 原因；
 *   - then 回调返回 Promise 时要等它落定（thenable 展开）。
 *
 * ——— 示例 ———
 * 输入：
 *   new MyPromise((resolve) => setTimeout(() => resolve(1), 10))
 *     .then((v) => v + 1)
 *     .then((v) => console.log(v));
 * 输出： 2
 */

class MyPromise {
  constructor() {
  }

  then() {
  }
}

// —— 自测 ——
new MyPromise((resolve) => setTimeout(() => resolve(1), 10))
  .then((v) => v + 1)
  .then((v) => console.log(v)); // 2

new MyPromise((_, reject) => reject('boom'))
  .then(null, (e) => console.log('caught', e)); // caught boom（值穿透 + reject）

module.exports = { MyPromise };
