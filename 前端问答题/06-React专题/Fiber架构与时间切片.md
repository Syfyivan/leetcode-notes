# React Fiber 架构与时间切片

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. 为什么要做 Fiber？（Stack Reconciler 的问题：递归不可中断，长任务阻塞主线程 → 掉帧）
2. Fiber 的定义：虚拟调用栈帧 + 链表结构（child / sibling / return），让递归变成可中断的循环
3. 双缓冲（Double Buffering）：current 树和 workInProgress 树交替使用
4. 两大阶段：
   - **Render 阶段（可中断）**：beginWork / completeWork，收集 Effect List
   - **Commit 阶段（不可中断，分 3 个子阶段）**：BeforeMutation / Mutation / Layout
5. 时间切片（Time Slicing）：`shouldYield` 判断剩余时间，不够就让出主线程
6. 优先级调度（Scheduler）：Lane 模型

## 常见追问

- Q: React 18 的并发模式和 Fiber 的关系？
  A:
- Q: Effect List（副作用链表）的作用是什么？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
