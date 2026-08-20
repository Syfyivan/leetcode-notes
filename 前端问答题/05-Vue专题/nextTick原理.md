# nextTick 原理

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. 为什么需要 nextTick？（Vue 的 DOM 更新是「异步批量」的，同一 Tick 的修改合并一次渲染）
2. nextTick 回调的执行时机？（本轮微任务末尾，DOM 更新后、浏览器绘制前）
3. 实现原理：降级策略 `Promise.then → MutationObserver → setImmediate → setTimeout(fn, 0)`，都是为了排进微任务 / 尽快的宏任务
4. `await nextTick()` 后一定能拿到最新 DOM 吗？哪些场景可能拿不到？

## 代码 / 例子

```js
// 改数据 → 立刻读 DOM（旧值）→ nextTick 后读（新值）的完整演示
```

## 常见追问

- Q: nextTick 和 setTimeout 相比，回调谁先执行？为什么？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
