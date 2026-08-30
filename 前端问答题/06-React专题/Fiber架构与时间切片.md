# React Fiber 架构与时间切片

## 核心回答（面试口述版，1 分钟能讲完）

老 React 用递归对比虚拟 DOM，调用栈一旦进去就不能停，长列表会卡住点击和动画。
Fiber 把树改成链表：每个节点有 `child`、`sibling`、`return`。递归变成 `while` 循环，循环里可以停。
停下来把主线程还给浏览器，下一帧再从记下的 Fiber 继续，这就是时间切片。
双缓冲：屏幕上那棵是 current，正在算的是 workInProgress，算完一次性切。
Render 阶段可中断，只算 diff、收集副作用。Commit 阶段不可中断，真正改 DOM。
React 18 的并发模式就建在 Fiber 上：`startTransition`、Suspense、自动批处理，用 Lane 标优先级。

## 展开

1. 为什么要做 Fiber？（Stack Reconciler 的问题：递归不可中断，长任务阻塞主线程 → 掉帧）

栈调和是同步递归。一次 `setState` 可能走完整棵组件树才返回。60fps 每帧只有约 16ms，JS 跑 100ms 点击就丢。无法把「动画、输入」插到更新中间。

2. Fiber 的定义：虚拟调用栈帧 + 链表结构（child / sibling / return），让递归变成可中断的循环

一个 Fiber 对应一个组件或 DOM 节点，字段包括 type、pendingProps、memoizedState、flags、lanes、alternate。遍历：先 child，没有就 sibling，再 return 回父。任何时刻只处理一个 Fiber，处理完看 `shouldYield`，该让就让。

3. 双缓冲（Double Buffering）：current 树和 workInProgress 树交替使用

current 是上次提交的树。更新时按 current 克隆出 workInProgress，两棵通过 `alternate` 互指。Commit 成功就把 root 的 current 指针拨过去。中途被高优先级打断，WIP 可以扔掉重来，屏幕不会花。

4. 两大阶段：
   - **Render 阶段（可中断）**：beginWork / completeWork，收集 Effect List
   - **Commit 阶段（不可中断，分 3 个子阶段）**：BeforeMutation / Mutation / Layout

beginWork 从上往下调和，completeWork 从下往上冒泡、建 DOM、把有副作用的 Fiber 串进 Effect List。Commit：BeforeMutation 调 `getSnapshotBeforeUpdate`；Mutation 增删改 DOM；Layout 同步跑 `useLayoutEffect` 和 `componentDidMount/Update`。然后浏览器绘制，再异步跑 `useEffect`。

5. 时间切片（Time Slicing）：`shouldYield` 判断剩余时间，不够就让出主线程

Scheduler 用 `MessageChannel` 或 `scheduler.yield` 把任务切成约 5ms 一片。`shouldYieldToHost()` 为 true 就暂停 Render。Commit 不切片，避免 DOM 改到一半。

6. 优先级调度（Scheduler）：Lane 模型

31 个位当 Lane。同步更新走 SyncLane，用户输入 Discrete，过渡更新 Transition，空闲 Idle。高优先级可以打断低优先级的 Render，复用一部分已经算完的节点。`startTransition` 就是把更新标成 Transition Lane。

## 延伸

- 相关题：setState 批处理、Hooks 挂在 Fiber 上、事件循环和帧预算。
- 对比题：Render 可中断，Commit 不能。时间切片不会把 DOM 改到一半。虚拟 DOM 还在，Fiber 是它的执行单元。
- 面试加码：`startTransition` / Lane。老 `ReactDOM.render` 没有完整并发，要 `createRoot`。

## 常见追问

- Q: React 18 的并发模式和 Fiber 的关系？
  A: Fiber 是 16 就有的数据结构，让「可中断」成为可能。真正默认打开并发能力是 18 的 `createRoot`。老的 `ReactDOM.render` 仍是同步模式。并发模式下才能用 `useTransition`、`useDeferredValue`、可中断的 Suspense。没有 Fiber 这些都谈不上。

- Q: Effect List（副作用链表）的作用是什么？
  A: Render 阶段不能碰 DOM，只在 Fiber 上打 flags（Placement / Update / Deletion）。有 flags 的节点用 `nextEffect`（后来改成 subtreeFlags + 遍历）串起来。Commit 只走这条链表，不必再扫整棵树。删除还要单独记，好去跑卸载 effect。

## 自己的易错点 / 之前答崩过的地方

我把 Fiber 说成「虚拟 DOM 的替代」。虚拟 DOM 还在，Fiber 是它的执行单元和链表形态。
以为时间切片会把 DOM 改到一半。切片只发生在 Render，Commit 是同步整段。
`ReactDOM.render` 和 `createRoot` 我当成一回事。18 的自动批处理、并发特性只在 createRoot 下完整。
