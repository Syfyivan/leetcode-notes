# Promise 三种状态与链式调用

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. 三种状态：pending / fulfilled / rejected，状态变化的不可逆性
2. `.then` 返回的是什么？这是链式调用成立的根本原因
3. `.then` 里 `return` 一个值 和 `return Promise.resolve(x)` 的区别
4. `.then` 里抛异常会怎样？能被后面的 `.catch` 接住吗？

## 代码 / 例子

```js
// 一道链式调用输出题：多层 return / throw / 穿透（没传回调）
```

## 常见追问

- Q: `.then(fn1, fn2)` 和 `.then(fn1).catch(fn2)` 的区别？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
