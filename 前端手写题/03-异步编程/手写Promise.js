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
 * 思路：
 * 1. 三个状态 pending / fulfilled / rejected，resolve、reject 只能改一次。
 * 2. then 返回新 Promise。无论当前是否已落定，回调都丢进 queueMicrotask。
 * 3. 回调不是函数就把值/原因原样交下去。返回值带 then 方法就再拆一次。
 *
 * ——— 示例 ———
 * 输入：
 *   new MyPromise((resolve) => setTimeout(() => resolve(1), 10))
 *     .then((v) => v + 1)
 *     .then((v) => console.log(v));
 * 输出： 2
 */

class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.fulfills = [];
    this.rejects = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.fulfills.forEach((fn) => fn());
    };
    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.rejects.forEach((fn) => fn());
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // 值穿透：不是函数就原样往下传；拒绝路径要继续 throw
    if (typeof onFulfilled !== 'function') onFulfilled = (v) => v;
    if (typeof onRejected !== 'function') {
      onRejected = (e) => {
        throw e;
      };
    }

    const run = (cb, resolve, reject) => {
      queueMicrotask(() => {
        try {
          const x = cb(this.value);
          if (x instanceof MyPromise) {
            x.then(resolve, reject);
          } else if (x && typeof x.then === 'function') {
            x.then(resolve, reject); // thenable 再拆一层
          } else {
            resolve(x);
          }
        } catch (e) {
          reject(e);
        }
      });
    };

    return new MyPromise((resolve, reject) => {
      const ok = () => run(onFulfilled, resolve, reject);
      const fail = () => run(onRejected, resolve, reject);
      if (this.state === 'fulfilled') ok();
      else if (this.state === 'rejected') fail();
      else {
        this.fulfills.push(ok);
        this.rejects.push(fail);
      }
    });
  }
}

// —— 自测 ——
new MyPromise((resolve) => setTimeout(() => resolve(1), 10))
  .then((v) => v + 1)
  .then((v) => console.log(v)); // 2

new MyPromise((_, reject) => reject('boom'))
  .then(null, (e) => console.log('caught', e)); // caught boom（值穿透 + reject）

module.exports = { MyPromise };
