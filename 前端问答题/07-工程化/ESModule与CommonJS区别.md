# ES Module 与 CommonJS 的区别

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

| 维度 | CommonJS（require / module.exports） | ES Module（import / export） |
| --- | --- | --- |
| 加载时机 | **运行时**同步加载（可放在 if 里、可动态变量路径） | **编译时**静态分析（必须在顶层、路径必须字符串字面量，tree-shaking 的基础） |
| 导出方式 | **值拷贝**（基本类型导出后原变量变，导入方不变） | **值引用**（引用绑定，原始值变，导入处同步变） |
| 加载位置 | 只能在 Node 环境（浏览器不原生支持，得打包） | 浏览器 & Node 14.8+ 原生支持；Node 里要 `.mjs` 或 `package.json` 设 `"type": "module"` |
| this 指向 | module 本身 | undefined（严格模式） |
| 动态导入 | 只能静态路径字符串 | 标准：`import()` 动态导入，返回 Promise |
| 默认导出处理 | module.exports 直接赋值 | `export default` 其实是语法糖，导出一个叫 default 的具名导出 |

## 代码 / 例子

```js
// CommonJS 导出值拷贝的经典坑 + ESM 引用绑定的对比
```

## 常见追问

- Q: 为什么 ESM 能 Tree Shaking 而 CJS 很难？
  A:
- Q: 循环依赖下 CJS 和 ESM 各自的行为？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
