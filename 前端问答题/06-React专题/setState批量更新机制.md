# setState 批量更新机制

## 核心回答（面试口述版，1 分钟能讲完）

setState 多数时候是异步的：先把更新排队，等这轮结束一起算、一起渲染。
React 16：合成事件和生命周期里批量；`setTimeout`、原生事件、Promise 里是同步一条条刷。
React 18 用 `createRoot` 之后，上面这些地方默认都批量，叫 Automatic Batching。
想立刻刷 DOM 用 `flushSync(() => setState(...))`。
同一个 state 连写三次 `setN(n+1)`，三次都读到旧 n，结果 +1。写成 `setN(n => n+1)` 才 +3。
函数组件里值相同（`Object.is`）会跳过渲染；类组件 `setState({})` 每次都更。

## 展开

1. **React 16 的规则**：合成事件 / 生命周期里是异步批量；原生事件 / setTimeout / Promise.then 里是同步逐条更新。背后是 `batchedUpdates` 方法控制

React 16 在事件插件里包了 `batchedUpdates`。出了这个范围，`isBatchingUpdates` 为 false，每次 setState 立刻 `forceUpdate`。所以 timeout 里两次 setState 触发两次 render。

2. **React 18 的改进**：默认全部自动批处理（Automatic Batching），无论在哪里调用 setState 都合并，除非你用 `flushSync` 强制立即刷新

18 把批处理收到根上的调度器。`createRoot` 下，timeout、Promise、原生 addEventListener 里连续 setState 也合成一次渲染。`ReactDOM.render` 老入口没有这套。`flushSync` 会同步执行到 commit，打断批处理，能卡住当前帧，少用。

3. setState 第二个参数 callback 和 useEffect + [state] 的区别（时机不同）

类组件 `setState(partial, cb)` 的 cb 在这次更新 commit 之后同步调用，能读到新 `this.state`。
函数组件没有第二个参数。`useEffect(() => {}, [state])` 在**绘制之后**异步跑；`useLayoutEffect` 更接近 class 的 callback，仍在绘制前。
需要「DOM 已经上屏再量」用 useEffect；需要「挡住绘制」用 LayoutEffect。

4. 如何保证拿到最新 state？传函数式更新 `setState(prev => prev + 1)` —— 这是核心习惯

批处理下多次读取闭包里的 state 都是同一份快照。函数式更新从 queue 里拿上一条结果。对象合并在 class 是浅合并，函数组件是整份替换，别把 `setUser({ name })` 当成还会保留 age。

## 延伸

- 相关题：Fiber Lane、Hooks dispatch、合成事件（16 只在合成事件里批量）。
- 对比题：类组件 `setState` 浅合并；函数组件替换整份 state。`setUser({ name })` 会把 age 盖掉。
- 面试加码：`flushSync` 只在必须同步读 DOM 时用。`startTransition` 和点击更新不在同一批。值相同 `Object.is` 会 bail out。

## 代码 / 例子

```js
// React 16：timeout 里两次 render；React 18 createRoot：一次 render
function onClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
}

setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
}, 0);

// 需要中间读 DOM 才 flushSync
import { flushSync } from 'react-dom';
flushSync(() => setCount((c) => c + 1));
console.log(el.textContent); // 已经是新的
```

## 常见追问

- Q: 传 `setState({})` 会触发更新吗？为什么？
  A: 类组件会。`setState` 默认当一次更新，空对象也走 shouldComponentUpdate（默认 true）。函数组件 `setState({})` 每次都是新对象，`Object.is` 不相等，也会渲染；`setCount(0)` 当前已是 0 则跳过。`useReducer` 返回同一引用也会 bail out。

- Q: React 18 自动批处理在 Transition / Suspense 里又是怎么工作的？
  A: 紧急更新（点击）和 `startTransition` 里的更新不在同一优先级。批处理按 Lane 分组：同一 Lane 合在一起，不同 Lane 分开渲染。Transition 可被打断，紧急更新先上屏，Suspense 的 fallback 也按优先级显示。所以「全批量」不等于「整个应用只有一次渲染」。

## 自己的易错点 / 之前答崩过的地方

18 之前我在 Promise 里连写两个 setState，以为会合并，结果 render 两次，请求打双份。
`setState({ ...state, x: 1 })` 在并发下可能盖掉别人刚排的字段，该用函数式 `prev => ({ ...prev, x: 1 })`。
`flushSync` 套在大列表更新外面，页面直接卡死。只在必须同步读 DOM 时用。
