# 手写 Promise 的核心思路

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. A+ 规范核心条款（状态机 / then 回调异步执行 / 值穿透 / 链式返回新 Promise / resolvePromise 决议过程）
2. 三个核心数据结构：`state`、`value`、`callbacks` 队列
3. resolvePromise（thenable 递归拆箱）的思路，怎么避免死循环

## 代码 / 例子

```js
// 贴自己手写版的核心 80 行左右（不要全贴全部测试用例）
```

## 常见追问

- Q: `.then` 里的回调为什么要放到微任务里？不这样会出什么问题？
  A:
- Q: A+ 规范的 2.3.3 讲的是什么？（就是 resolvePromise 那坨）
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
