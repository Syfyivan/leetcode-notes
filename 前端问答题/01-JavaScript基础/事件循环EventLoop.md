# 事件循环 Event Loop

## 核心回答（面试口述版，1 分钟能讲完）

JS 是单线程，同步代码跑完才轮到异步回调。
浏览器里一轮循环大致是：调用栈清空 → 把当前微任务队列清空 → 有需要就渲染 → 取出一个宏任务再开一轮。
微任务主要是 `Promise.then` / `queueMicrotask` / `MutationObserver`。宏任务是 `setTimeout` / `setInterval` / 事件 / `postMessage`。
`async/await` 在 await 后面的代码等价于 `Promise.then`，也是微任务。
`setTimeout(fn, 0)` 不是立刻跑，最早也要等这一轮微任务和可能的渲染结束。
Node 不按「宏/微」两层切，是 libuv 六个阶段，阶段之间先清 `process.nextTick`，再清 Promise 微任务。

## 展开

1. 浏览器和 Node.js 的 Event Loop 有什么不同？（至少两点）

- 浏览器：宏任务队列 + 微任务队列。一次只取一个宏任务，然后把微任务掏空，再考虑渲染。
- Node（libuv）：六个阶段转圈，`timers` → `pending callbacks` → `idle/prepare` → `poll` → `check` → `close`。`setTimeout` 在 timers，`setImmediate` 在 check，I/O 回调在 poll。
- Node 多一个 `process.nextTick` 队列，优先级比 `Promise.then` 还高。某个阶段结束会先把 nextTick 跑完，再跑微任务。nextTick 套太多会饿死 I/O。
- 浏览器有渲染机会（rAF、style、paint）；Node 没有页面，但有 I/O 阻塞在 poll。

2. 宏任务 / 微任务的常见成员各有哪些？

微任务：`Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver`、Node 的 `process.nextTick`（比 Promise 更急）。
宏任务：`setTimeout` / `setInterval`、I/O、UI 事件、`postMessage`、`MessageChannel`、`setImmediate`（仅 Node / 老 IE）、`script` 整段脚本本身也算第一段宏任务。

3. 一次 Tick 的完整流程（调用栈清空 → 取微任务全部跑完 → 渲染 → 取一个宏任务）

当前宏任务（比如整份 script）跑完，调用栈空了。
取出微任务队列，一个个执行；执行过程中新注册的微任务也在本轮清完。
有空闲且需要画，就走 rAF → 样式计算 → 布局 → 绘制。
再从宏任务队列取一个（最早到期的 timer 或事件），进入下一轮。

## 延伸

- 相关题：微任务宏任务执行顺序、async/await。输出题经常三连问。
- 对比题：浏览器两层队列 vs Node 六个阶段 + `process.nextTick`。
- 面试加码：`requestAnimationFrame` 挂在画帧前；`queueMicrotask` 和 `then` 同层。

## 代码 / 例子

```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');
  Promise.resolve().then(() => console.log('4'));
});

(async () => {
  console.log('5');
  await 0;
  console.log('6');
})();

console.log('7');
// 1 5 7 3 6 4 2
// await 0 后面是微任务；微任务里再 then 仍在本轮
```

## 常见追问

- Q: `Promise.resolve().then` 和 `setTimeout(fn, 0)` 谁先执行？为什么？
  A: then 先。then 进微任务，timeout 进宏任务。同步代码一结束先清微任务，timeout 要等下一轮宏任务。delay 写成 0 也一样，规范里嵌套 timeout 还有 4ms 下限（HTML 规范），更不可能插队。

- Q: requestAnimationFrame 属于宏任务还是微任务？大概在哪个阶段？
  A: 两边都不是。它挂在渲染流水线里，浏览器准备画帧之前调用，在微任务清空之后、paint 之前。一帧通常最多跑一次。别拿它和 setTimeout 比快慢，一卡帧它就晚了 16ms。

## 自己的易错点 / 之前答崩过的地方

我以前把 `async` 函数一进来的同步部分也当成微任务。其实 `async` 函数调用当下就同步执行，碰到 `await` 才把后面注册成微任务。
`setTimeout(fn, 0)` 我答过「马上执行」，面试官追问渲染和微任务就把我问住了。
Node 里把 `setImmediate` 和 `setTimeout` 说成固定顺序。主模块里两者是竞赛，谁先到看启动快慢；在 I/O 回调里 `setImmediate` 才稳赢。
