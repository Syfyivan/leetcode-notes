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
    if (typeof executor !== 'function') throw new TypeError('executor 必须是函数');
    this.state = 'pending';
    this.value = undefined;
    this.fulfills = [];
    this.rejects = [];

    const fulfill = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.fulfills.forEach((fn) => fn());
    };
    const rejectInternal = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.rejects.forEach((fn) => fn());
    };

    // executor 一旦调用 resolve/reject 就被锁定。resolve 一个 pending thenable 时，
    // state 暂时仍是 pending，但 executor 后续再 reject 也不能反悔。
    let locked = false;
    const adopt = (value) => {
      if (value === this) {
        rejectInternal(new TypeError('Promise 不能 resolve 自己'));
        return;
      }
      if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
        let then;
        try {
          then = value.then;
        } catch (error) {
          rejectInternal(error);
          return;
        }
        if (typeof then === 'function') {
          let called = false;
          try {
            then.call(
              value,
              (nextValue) => {
                if (called) return;
                called = true;
                if (nextValue === value) {
                  rejectInternal(new TypeError('Thenable 不能 resolve 自己'));
                } else {
                  adopt(nextValue);
                }
              },
              (reason) => {
                if (called) return;
                called = true;
                rejectInternal(reason);
              }
            );
          } catch (error) {
            if (!called) rejectInternal(error);
          }
          return;
        }
      }
      fulfill(value);
    };

    const resolve = (value) => {
      if (locked) return;
      locked = true;
      adopt(value);
    };
    const reject = (reason) => {
      if (locked) return;
      locked = true;
      rejectInternal(reason);
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e); // new 当下抛错等价于 reject
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const run = (callback, fulfilled) => {
        queueMicrotask(() => {
          try {
            if (typeof callback !== 'function') {
              if (fulfilled) resolve(this.value);
              else reject(this.value);
              return;
            }
            // child 的 resolve 会展开 Promise / thenable，也会挡住返回 child 自己的环。
            resolve(callback(this.value));
          } catch (error) {
            reject(error);
          }
        });
      };
      const ok = () => run(onFulfilled, true);
      const fail = () => run(onRejected, false);
      if (this.state === 'fulfilled') ok();
      else if (this.state === 'rejected') fail();
      else {
        this.fulfills.push(ok);
        this.rejects.push(fail); // 还没落定，先登记，到点再挨个叫
      }
    });
  }
}

/**
 * 延伸 1：catch / finally
 *
 * 需求：
 *   - catch(onRejected) 等价于 then(undefined, onRejected)；
 *   - finally(callback) 无论成败都执行 callback，等待它结束后再透传原值或原错误。
 *
 * 思路：finally 的成功分支执行回调后 return 原值；失败分支执行回调后重新 throw 原因。
 * 回调若返回 Promise，MyPromise.resolve 会等它落定。
 *
 * ——— 示例 ———
 * 输入：MyPromise.reject('boom').finally(cleanup).catch(e => e)
 * 输出：先执行 cleanup，最后得到 'boom'
 */
MyPromise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

MyPromise.prototype.finally = function (callback) {
  const run = typeof callback === 'function' ? callback : () => callback;
  return this.then(
    (value) => MyPromise.resolve(run()).then(() => value),
    (reason) => MyPromise.resolve(run()).then(() => { throw reason; })
  );
};

/**
 * 延伸 2：静态 resolve / reject
 *
 * 需求：把普通值、原生 Promise 或任意 thenable 统一转成 MyPromise；reject 直接创建失败实例。
 *
 * 思路：同类实例可原样返回，其余交给构造器的 resolve 过程自动展开。
 *
 * ——— 示例 ———
 * 输入：MyPromise.resolve(Promise.resolve(7)).then(console.log)
 * 输出：7
 */
MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) return value;
  return new MyPromise((resolve) => resolve(value));
};

MyPromise.reject = function (reason) {
  return new MyPromise((_, reject) => reject(reason));
};

// promises-aplus-tests 约定的适配入口，便于把实现交给规范测试套件。
MyPromise.deferred = function () {
  const deferred = {};
  deferred.promise = new MyPromise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

// —— 自测 ——
new MyPromise((resolve) => setTimeout(() => resolve(1), 10))
  .then((v) => v + 1)
  .then((v) => console.log(v)); // 2

new MyPromise((_, reject) => reject('boom'))
  .then(null, (e) => console.log('caught', e)); // caught boom（值穿透 + reject）

module.exports = { MyPromise };
