# 手写 Promise 的核心思路

## 核心回答（面试口述版，1 分钟能讲完）

自己写 Promise 就是一台状态机加一条回调队列。
三个字段：`state`、`value`/`reason`、`onFulfilled`/`onRejected` 两个数组。
executor 里调 `resolve`/`reject` 落定状态，落定后把队列里的回调拿去微任务里跑。
`then` 永远返回新 Promise。回调的返回值交给 `resolvePromise` 拆箱：普通值直接 resolve，thenable 就调它的 `then`，必要时递归。
then 没传函数要做值穿透：成功原样递，失败再 throw。
回调必须异步，用 `queueMicrotask`。已经敲定的 Promise 再 then，也不能同步跑。
`promise2 === x` 要拒掉，防止循环引用卡死。

## 展开

1. A+ 规范核心条款（状态机 / then 回调异步执行 / 值穿透 / 链式返回新 Promise / resolvePromise 决议过程）

- 三态，只能 pending → fulfilled / rejected，不可逆。
- `then` 可调多次，pending 时把回调推进数组。
- 回调必须异步（`then` 2.2.4），当前栈还没清完不能跑。
- 参数不是函数就穿透。
- `then` 返回新 Promise。
- 决议过程 2.3：对返回值 x 拆箱，见下面。

2. 三个核心数据结构：`state`、`value`、`callbacks` 队列

`state` 决定走哪条路。`value` / `reason` 存结果。两个数组是因为 pending 时 then 可能被调很多次，resolve 那一刻要按登记顺序全部触发。一旦落定，后续 then 不用入队，直接按当前状态丢进微任务。

3. resolvePromise（thenable 递归拆箱）的思路，怎么避免死循环

x 是普通值 → resolve。x 是对象或函数 → 取 `x.then`。是函数就当 thenable，`then.call(x, resolvePromise, reject)`，成功回调里继续拆。
防死循环：`promise2 === x` 直接 `TypeError`。防多次调用：`called` 锁，resolve/reject 只认第一次。取 `x.then` 和调 `then` 都要 try/catch，抛错且没 called 才 reject。

## 延伸

- 相关题：Promise 状态链、微任务、手写 `Promise.all`。
- 对比题：A+ 测的是 thenable 拆箱和异步回调，不是 async/await 语法糖。
- 面试加码：`catch` 等于 `then(undefined, fn)`；值穿透的 reject 分支必须 `throw e`，写成 `(e) => e` 会吞错。`resolve` 完整版也要走 resolvePromise。

## 代码 / 例子

```js
const PENDING = 'pending', FULFILLED = 'fulfilled', REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilled = [];
    this.onRejected = [];

    const resolve = (v) => {
      if (this.state !== PENDING) return;
      this.state = FULFILLED;
      this.value = v;
      this.onFulfilled.forEach((fn) => fn());
    };
    const reject = (r) => {
      if (this.state !== PENDING) return;
      this.state = REJECTED;
      this.reason = r;
      this.onRejected.forEach((fn) => fn());
    };
    try { executor(resolve, reject); } catch (e) { reject(e); }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected = typeof onRejected === 'function' ? onRejected : (e) => { throw e; };

    const p2 = new MyPromise((resolve, reject) => {
      const run = (cb, val) => {
        queueMicrotask(() => {
          try {
            resolvePromise(p2, cb(val), resolve, reject);
          } catch (e) { reject(e); }
        });
      };
      if (this.state === FULFILLED) run(onFulfilled, this.value);
      else if (this.state === REJECTED) run(onRejected, this.reason);
      else {
        this.onFulfilled.push(() => run(onFulfilled, this.value));
        this.onRejected.push(() => run(onRejected, this.reason));
      }
    });
    return p2;
  }
}

function resolvePromise(p2, x, resolve, reject) {
  if (p2 === x) return reject(new TypeError('Chaining cycle'));
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => { if (called) return; called = true; resolvePromise(p2, y, resolve, reject); },
          (r) => { if (called) return; called = true; reject(r); }
        );
      } else resolve(x);
    } catch (e) { if (!called) { called = true; reject(e); } }
  } else resolve(x);
}
```

## 常见追问

- Q: `.then` 里的回调为什么要放到微任务里？不这样会出什么问题？
  A: A+ 要求 then 回调异步，保证 `then` 注册的时候同步代码已经把后续 `then` 挂上。如果 resolve 里同步跑回调，下面这题会丢第二次 then：`p.then(() => { p.then(() => console.log(2)) }); console.log(1)` 期望先 1 后 2。同步执行还会让 `then` 里访问还未初始化的变量，时序完全不可预测。

- Q: A+ 规范的 2.3.3 讲的是什么？（就是 resolvePromise 那坨）
  A: x 是对象或函数时怎么拆 thenable。先 `let then = x.then`（只取一次，避免 getter 副作用跑两遍），`typeof then === 'function'` 就 `then.call(x, resolvePromise, reject)`，否则当普通对象 resolve。这才能兼容别人的 Promise / jQuery Deferred。`called` 和循环检测都在这一节。

## 自己的易错点 / 之前答崩过的地方

我第一次写在 `resolve` 里直接调回调，没 `queueMicrotask`，promises-aplus-tests 一堆失败。
值穿透的 reject 分支写成 `(e) => e`，错误被吞成 fulfilled。必须 `throw e`。
`resolve` 自己没拆 thenable：`resolve(anotherPromise)` 按规范应该采用 anotherPromise 的状态，简易版常漏这一步。面试说「完整版 resolve 也要走 resolvePromise」就够了。
