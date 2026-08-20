# 事件循环 Event Loop

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. 浏览器和 Node.js 的 Event Loop 有什么不同？（至少两点）
2. 宏任务 / 微任务的常见成员各有哪些？
3. 一次 Tick 的完整流程（调用栈清空 → 取微任务全部跑完 → 渲染 → 取一个宏任务）

## 代码 / 例子

```js
// 写一道 6~10 行的混合输出题，含 setTimeout / Promise.then / async/await
```

## 常见追问

- Q: `Promise.resolve().then` 和 `setTimeout(fn, 0)` 谁先执行？为什么？
  A:
- Q: requestAnimationFrame 属于宏任务还是微任务？大概在哪个阶段？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
