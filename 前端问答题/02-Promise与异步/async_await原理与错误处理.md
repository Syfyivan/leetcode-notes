# async / await 原理与错误处理

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. async 函数本质上返回什么？写了 `return 123` 外面拿到的是什么？
2. await 做了哪两件事？（暂停执行 + 等待 Promise settle + 恢复）
3. async/await 相比 `.then` 链的优势（同步写法、错误栈、调试、循环控制）
4. 错误处理三种模式：try/catch、`.catch`、顶层 `unhandledrejection`

## 代码 / 例子

```js
// await 在 for 循环里 vs forEach 里的区别（经典坑）
```

## 常见追问

- Q: `await` 后面接非 Promise 值会怎样？
  A:
- Q: async 函数里的异常和 Promise reject 的关系？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
