# setState 批量更新机制

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. **React 16 的规则**：合成事件 / 生命周期里是异步批量；原生事件 / setTimeout / Promise.then 里是同步逐条更新。背后是 `batchedUpdates` 方法控制
2. **React 18 的改进**：默认全部自动批处理（Automatic Batching），无论在哪里调用 setState 都合并，除非你用 `flushSync` 强制立即刷新
3. setState 第二个参数 callback 和 useEffect + [state] 的区别（时机不同）
4. 如何保证拿到最新 state？传函数式更新 `setState(prev => prev + 1)` —— 这是核心习惯

## 代码 / 例子

```js
// React 16 里 setTimeout 外 / 内 setState 行为对比；React 18 的 flushSync 用法
```

## 常见追问

- Q: 传 `setState({})` 会触发更新吗？为什么？
  A:
- Q: React 18 自动批处理在 Transition / Suspense 里又是怎么工作的？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
