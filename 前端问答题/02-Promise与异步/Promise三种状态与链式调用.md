# Promise 三种状态与链式调用

## 核心回答（面试口述版，1 分钟能讲完）

Promise 三个状态：`pending`、`fulfilled`、`rejected`。pending 只能往后面两个走，且只能走一次，不可逆。
`then` 每次都返回一个**新** Promise，所以才能 `.then().then()`。
`then` 里 `return 值` 会把下一个 Promise fulfill 成这个值；`return` 一个 Promise 就采用它的状态。
`then` 里 `throw` 或 return 一个 rejected Promise，后面的 `catch` 能接到。
`then` 不传回调叫值穿透：`p.then().then(fn)` 等于把值原样往后递。
`then` 的回调一定是异步的，即使 Promise 已经敲定，也要等当前同步代码跑完、进微任务再执行。

## 展开

1. 三种状态：pending / fulfilled / rejected，状态变化的不可逆性

创建时是 pending。`resolve` 变 fulfilled 并带 value，`reject` 变 rejected 并带 reason。已经敲定再调 resolve/reject 直接忽略。`Promise.resolve` 对 thenable 会拆箱，对已经是 Promise 的会原样返回。

2. `.then` 返回的是什么？这是链式调用成立的根本原因

永远返回新 Promise，记作 p2。p2 的状态由回调的返回值决定，跟原来那个 p1 无关。所以可以无限 `.then`，每环都是新任务。

3. `.then` 里 `return` 一个值 和 `return Promise.resolve(x)` 的区别

`return 1`：p2 直接 fulfilled，值是 1。
`return Promise.resolve(1)`：p2 要等这个 Promise 敲定再采用，多一次微任务。对调用方最终值一样，时序上后者更晚一轮微任务。`return` 一个 pending 的 Promise，p2 会一直等到它。

4. `.then` 里抛异常会怎样？能被后面的 `.catch` 接住吗？

回调里 `throw`，p2 变成 rejected，后续 `.catch` 或 `then` 的第二个参数能接到。已经 return 出去之后再 throw 就跟这条链无关了。`catch` 自己再 throw，后面还得再接一次。

## 延伸

- 相关题：手写 Promise、async/await、微任务输出题。
- 对比题：链式每环都是新 Promise，不是 return this。`then` 里忘了 return，下一个 then 拿到 `undefined`。
- 面试加码：`finally` 默认透传 value/reason，它 throw 才会改状态。`Promise.resolve` 对 thenable 会拆箱。

## 代码 / 例子

```js
Promise.resolve(1)
  .then((v) => v + 1)                 // 2
  .then((v) => { throw new Error(v); })
  .then((v) => console.log('ok', v))  // 跳过
  .catch((e) => {
    console.log('catch', e.message);  // 'catch 2'
    return 3;
  })
  .then()                             // 值穿透，3
  .then((v) => console.log(v));       // 3
```

## 常见追问

- Q: `.then(fn1, fn2)` 和 `.then(fn1).catch(fn2)` 的区别？
  A: `then(fn1, fn2)` 里 fn2 只接当前 Promise 的 reject，接不住 fn1 里 throw 或 return reject。`.then(fn1).catch(fn2)` 中间多一个 Promise，fn1 抛错也会进 catch。日常错误处理用后一种。两个都写时，catch 还能接到 fn1 的失败。

## 自己的易错点 / 之前答崩过的地方

我以前以为 `then` 返回 this，所以能链式。其实每次都是新 Promise，这也是值穿透和错误冒泡的原因。
`return Promise.resolve(x)` 我当成和 `return x` 同一拍。多一轮微任务，输出题会差一行。
`then` 里写了异步但没 return Promise，下一个 then 马上拿到 `undefined`。忘了 return 是高频翻车。
