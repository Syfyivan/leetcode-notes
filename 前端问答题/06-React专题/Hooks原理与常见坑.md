# React Hooks 原理与常见坑

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

### 原理

1. Hooks 存在哪？（Fiber 节点上的 `memoizedState`，是个**链表**，按调用顺序串起来）
2. useState：首次渲染创建 Hook 节点 + initialState；更新时走 dispatch → enqueueUpdate → 调度
3. useEffect：`effect` 链表 + `updateQueue`；依赖数组浅比较（Object.is）决定要不要重新跑
4. 为什么 Hooks 不能写在条件 / 循环里？（链表按顺序对应，顺序一变索引就错了）

### 常见坑（至少 5 个，面试反复问）

1. useEffect 依赖数组漏写 → 拿到旧 state
2. useEffect 空数组 + 写了依赖 → 警告 vs 闭包陷阱的取舍
3. setState 传函数 vs 传值的区别
4. useMemo / useCallback 的正确使用场景（不是越多越好）
5. useRef 获取最新值（绕闭包）、useImperativeHandle、useLayoutEffect

## 常见追问

- Q: useLayoutEffect 和 useEffect 的执行时机差在哪？（Layout 在 Commit 的 Layout 子阶段，同步阻塞绘制；Effect 在绘制后异步）
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
