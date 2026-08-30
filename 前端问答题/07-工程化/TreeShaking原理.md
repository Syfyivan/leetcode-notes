# Tree Shaking 原理

## 核心回答（面试口述版，1 分钟能讲完）

Tree Shaking 是打包时把没用到的导出删掉，像摇树把枯叶抖掉。
前提是 ESM。静态 import/export 才能在编译期画出「谁用了谁」。
从入口走一遍，用到的 export 打标，没标到的当死代码交给压缩器删。
模块顶层有副作用（改全局、polyfill、CSS）就不能随便删整文件。`package.json` 的 `sideEffects` 用来声明。
CJS、`export default { a, b }`、TS 编成 CommonJS，摇树会失效。
lodash 要 `lodash-es` 或按文件 `import get from 'lodash/get'`，否则整包打进来。

## 展开

1. 前提条件：**模块必须是 ESM**（静态结构，编译期可分析出 import/export 的依赖关系）

`import { foo } from './m'` 明确只用 foo。`require` 可能是变量路径，分析器不敢删。生产模式还要开压缩（Terser / esbuild minify）才会真把没标记的函数从产物拿掉。

2. 基于「标记—清除」思想：
   - 从入口模块出发，遍历用到的 export，打上「被用」标记
   - 没被标记的 export 视为死代码，从产物中移除

webpack 的 `usedExports` 在图上标哪些导出被用。minify 阶段看到 `/* unused */` 或未引用的函数声明就删。Rollup 更激进，直接不把没用的语句放进 chunk。

3. 副作用（Side Effects）的处理：
   - 模块顶层有副作用代码 → 打包器会保守处理，整颗都不摇
   - `package.json` 的 `"sideEffects": false / ["*.css", "./src/polyfill.js"]` 配置告诉打包器哪些模块有副作用
   - `/*#__PURE__*/` 注释告诉压缩器某函数调用是纯的，没用上就可以整条删

`sideEffects: false` 表示「任意导出没用就可以删整个文件」。CSS、改 `prototype` 的 polyfill 必须列进数组，不然样式没了。babel 转 class 时会给 helper 打 PURE，方便摇掉没用的类。

4. 常见失效场景（踩坑清单）：
   - 用了 CJS（require）
   - 导出对象整体使用 `export default { a, b, c }` 而不是具名导出 → 结构分析不出来
   - 函数里有副作用标记错误
   - TS 编译目标设成 CommonJS

还有：`import _ from 'lodash'` 默认入口是 CJS；babel 把 ESM 转 CJS 太早；`Object.keys(mod)` 动态访问；re-export 写成 `export * from` 有的打包器分析不全。

## 常见追问

- Q: Webpack 里 `usedExports` 和 `sideEffects` 分别控制什么？
  A: `optimization.usedExports`：在模块内部标哪些 export 被用，压缩器据此删函数，细到语句。`optimization.sideEffects`（配合 package.json）：允许直接不打包整个文件，粗到文件级。生产模式默认都开。只开 usedExports 但库没标 sideEffects false，一个 `utils/index.js` 里 re-export 100 个函数，可能仍把文件留下一截。

- Q: 为什么 import 了 CSS 文件不会被 Tree Shaking？
  A: CSS 文件没有 ESM 导出图，它的意义就是副作用：把样式插进页面。打包器把它当 side-effectful 资源，用就整份进包。要拆 CSS 得靠 code split 或 CSS Modules 按组件引用。`sideEffects: false` 写错会把 CSS 摇没，页面裸奔。

## 自己的易错点 / 之前答崩过的地方

组件库我写成 `export default { Button, Input }`，业务 `import UI from 'lib'; <UI.Button />`，整份 UI 都打进来。改具名 `export { Button }`。
`tsconfig` `module: CommonJS`，源码看着是 import，产物已经是 require。
以为开发模式也能看出摇树效果。dev 为了速度常常不 minify，要看 production bundle 分析。
