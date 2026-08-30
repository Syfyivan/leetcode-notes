# React Hooks 原理与常见坑

## 核心回答（面试口述版，1 分钟能讲完）

Hooks 挂在当前 Fiber 的 `memoizedState` 上，是一条链表，按调用顺序一个一个对。
所以不能写在 if / for 里，顺序一变，这次的 useState 就会读到上次的 useEffect。
useState：首次把初值存进链表节点，更新走 dispatch，把更新排队，再调度一次渲染。
useEffect：依赖用 `Object.is` 浅比较。没变就跳过。函数本身每次 render 都是新的，所以依赖漏了会闭包到旧 state。
useLayoutEffect 在 DOM 改完、浏览器绘制前同步跑，能挡住闪烁。useEffect 在绘制之后。
过期闭包最常见：effect 空数组里用了 state，却不把 state 放进依赖。用函数式更新或 ref 能绕。

## 展开

### 原理

1. Hooks 存在哪？（Fiber 节点上的 `memoizedState`，是个**链表**，按调用顺序串起来）

当前正在工作的 Fiber 存在全局 `currentlyRenderingFiber`。每调一次 Hook，指针 `workInProgressHook` 往后走一个。链表节点字段：`memoizedState`、`queue`、`next`。Dev 模式会检测钩子数量变化并报警。

2. useState：首次渲染创建 Hook 节点 + initialState；更新时走 dispatch → enqueueUpdate → 调度

`useState(0)` 第一次把 0 写入节点。返回的 setter 闭包了那条 queue。多次 `setState` 在 React 18 会进同一条更新队列，渲染时从 baseState 一路算到最新。`setState(1)` 和当前值 `Object.is` 相同会 bail out，不重渲染。

3. useEffect：`effect` 链表 + `updateQueue`；依赖数组浅比较（Object.is）决定要不要重新跑

Render 时只记录 `create`、`deps`。Commit 的 Layout 阶段之后，绘制完成，被动 effect 再跑。先跑上一次的 destroy，再跑这次的 create。依赖是逐项 `Object.is`，对象字面量每次都是新的，等于没写缓存。

4. 为什么 Hooks 不能写在条件 / 循环里？（链表按顺序对应，顺序一变索引就错了）

没有名字，全靠第几个。`if (flag) useState()` 让两次渲染链表长度不同，后面的 Hook 全部错位，state 串门。eslint-plugin-react-hooks 的 `rules-of-hooks` 就是拦这个。

### 常见坑（至少 5 个，面试反复问）

1. useEffect 依赖数组漏写 → 拿到旧 state

空数组只在挂载跑一次，里面的 `count` 永远是 0。补依赖，或 `setCount(c => c + 1)`。

2. useEffect 空数组 + 写了依赖 → 警告 vs 闭包陷阱的取舍

exhaustive-deps 会吵。真要「只挂载一次」又读最新值，把值放 `useRef`，effect 里读 `ref.current`。

3. setState 传函数 vs 传值的区别

`setN(n + 1)` 连续三次可能只 +1，因为三次都读到同一拍的 n。`setN(n => n + 1)` 三次 +3。事件处理里要基于最新值就用函数。

4. useMemo / useCallback 的正确使用场景（不是越多越好）

留给「计算贵」或「要交给 memo 子组件当 props」的情况。每次都包一层，依赖写错比不包更亏。React 编译器（React 19 Compiler）能自动做一部分，手写仍要懂依赖。

5. useRef 获取最新值（绕闭包）、useImperativeHandle、useLayoutEffect

ref 改 `.current` 不触发渲染。父要调子方法：`forwardRef` + `useImperativeHandle`。量尺寸、同步滚动用 LayoutEffect，避免闪一下。LayoutEffect SSR 会警告，服务端没有 DOM。

## 延伸

- 相关题：Fiber 的 memoizedState 链表、setState 批量、过期闭包。
- 对比题：`setN(n + 1)` 连写三次可能只 +1；`setN(n => n + 1)` 才 +3。
- 面试加码：不能写进 if / for，链表顺序一变 state 串门。自定义 Hook 返回新对象每次都是新引用，外层当依赖会把 effect 绕死。

## 常见追问

- Q: useLayoutEffect 和 useEffect 的执行时机差在哪？（Layout 在 Commit 的 Layout 子阶段，同步阻塞绘制；Effect 在绘制后异步）
  A: 顺序：commit DOM → **useLayoutEffect**（同步）→ 浏览器 paint → **useEffect**（异步）。Layout 里读 `getBoundingClientRect` 是新布局。它会推迟首次绘制，别放耗时逻辑。需要订阅、打点、请求，用 useEffect。

## 自己的易错点 / 之前答崩过的地方

定时器 effect 里 `setCount(count + 1)`，依赖写 `[]`，界面永远 1。改函数式更新才好。
`useCallback(() => onChange(id), [])` 把过期的 onChange 传给子，子 memo 也救不了逻辑。
自定义 Hook 里 return 新对象每次都是新引用，外层再当依赖，effect 死循环。要用 `useMemo` 包返回值，或别把整个对象放依赖。
