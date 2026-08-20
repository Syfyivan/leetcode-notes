# Tree Shaking 原理

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. 前提条件：**模块必须是 ESM**（静态结构，编译期可分析出 import/export 的依赖关系）
2. 基于「标记—清除」思想：
   - 从入口模块出发，遍历用到的 export，打上「被用」标记
   - 没被标记的 export 视为死代码，从产物中移除
3. 副作用（Side Effects）的处理：
   - 模块顶层有副作用代码 → 打包器会保守处理，整颗都不摇
   - `package.json` 的 `"sideEffects": false / ["*.css", "./src/polyfill.js"]` 配置告诉打包器哪些模块有副作用
   - `/*#__PURE__*/` 注释告诉压缩器某函数调用是纯的，没用上就可以整条删
4. 常见失效场景（踩坑清单）：
   - 用了 CJS（require）
   - 导出对象整体使用 `export default { a, b, c }` 而不是具名导出 → 结构分析不出来
   - 函数里有副作用标记错误
   - TS 编译目标设成 CommonJS

## 常见追问

- Q: Webpack 里 `usedExports` 和 `sideEffects` 分别控制什么？
  A:
- Q: 为什么 import 了 CSS 文件不会被 Tree Shaking？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
