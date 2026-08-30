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
 *
 * ——— 延伸 ———
 * - catch 就是 then(null, onRejected)。finally 不论成败都跑，再把原值/原因接着传。
 * - resolve 了一个 Promise：要先拆开，不能把 Promise 对象当 value 存。
 * - 同一个 Promise 可以 then 多次，所以 fulfills 是数组。
 *
 * ——— 常见追问 ———
 * Q: 为什么 then 回调必须异步？
 * A: A+ 规定。已经落定再 then 如果同步跑，和 pending 时登记的时序会拧在一起。
 *    queueMicrotask 丢进微任务，和原生一致。
 *
 * Q: 值穿透时拒绝路径为什么要 throw？
 * A: 成功路径 return 原值，链继续成功。拒绝路径也 return 的话，后面 then 会当成成功。
 *    throw 才能让失败接着往下走。
 *
 * Q: resolve 为什么先看是不是 pending？
 * A: 状态只能改一次。executor 里先 resolve 再 throw，不能把已经成功的改成失败。
 *
 * Q: instanceof 和 thenable 都要拆？
 * A: 自己人走自己的 then。别人家的 Promise、带 then 方法的普通对象也要等它落定。
 *
 * Q: 已经 fulfilled 了再 then，还要 queueMicrotask 吗？
 * A: 要。两种时序混用，.then().then() 的顺序会和原生不一样，很难查。
 */

class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.fulfills = [];
    this.rejects = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return; // 状态只能改一次，后面的 resolve/reject 丢掉
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
      reject(e); // new 当下抛错等价于 reject
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
      queueMicrotask(() => { // then 回调必须异步，和原生微任务对齐
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
        this.rejects.push(fail); // 还没落定，先登记，到点再挨个叫
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
