# 模块机制CommonJS与ESM

## 核心回答（面试口述版，1 分钟能讲完）

Node 里两套模块：CommonJS 是运行时同步 `require`，导出一份值的拷贝，结果缓存在 `require.cache`；ESM 是编译期静态 `import`，导出的是 live binding，加载过程可以是异步的。面试讲清楚三件事：`require` 只会真正跑一次；`module.exports` 才是导出对象，`exports` 只是它的别名；ESM 能 tree-shaking 是因为依赖图静态可见，CJS 的 `require(动态路径)` 做不到。

## 展开

1. require 的加载与缓存机制

   `require(id)` 大致四步：
   - **resolve**：按核心模块 → 相对/绝对路径 → `node_modules` 往上找，带上 `.js/.json/.node` 和 `package.json` 的 `main`
   - **cache**：`Module._cache`（`require.cache`）命中就直接返回 `module.exports`，不再执行文件
   - **load + wrap**：源码被包成 `(function (exports, require, module, __filename, __dirname) { ... })`
   - **compile**：跑这个函数，给 `module.exports` 赋值

   所以单例很自然：同一个绝对路径，全进程共享一份 exports。要重载只能 `delete require.cache[id]`。

2. module.exports 和 exports 的区别与坑

   包装函数一开始做了 `exports = module.exports = {}`。`exports.foo = 1` 等于给那个对象加字段，外面 `require` 看得到。写成 `exports = { foo: 1 }` 只改了局部变量，`module.exports` 还是旧对象。要整体换导出对象必须 `module.exports = ...`。`export default` 在 CJS 互操作里常变成 `require().default`，这是 interop 坑，不是语法糖。

3. CommonJS 同步加载 vs ESM 静态分析、异步加载

   CJS：遇到 `require` 立刻同步读文件、执行，循环依赖时拿到的是「写到一半」的 `module.exports`。
   ESM：`import` 声明提升，链接阶段就建好导出绑定；`import()` 动态导入返回 Promise。ESM 的导出是引用，源模块改 `export let x`，导入方下次读就是新值。Node 用 `.mjs`、或 `package.json` 的 `"type": "module"` 才走 ESM。CJS 里不能顶层 `import`，反过来 ESM 里 `require` 要靠 `createRequire`。

## 代码 / 例子

```js
// a.js
exports.n = 1;
module.exports.n = 2;
exports = { n: 3 };          // 丢了，外面拿到 n === 2

// 循环依赖
// a.js
const b = require('./b');    // b.x 此时是 undefined
exports.a = 1;
// b.js
const a = require('./a');    // a.a 此时是 undefined（a 还没跑完）
exports.x = a.a;
```

## 常见追问

- Q: 循环依赖时 CommonJS 会发生什么？
  A: 先加载的模块还没执行完就被对方 `require`，缓存里已经有这个 Module 对象，于是返回当前这份不完整的 `module.exports`。不会死循环，但字段可能是 `undefined`。ESM 用 live binding，对方读的是绑定，等源模块执行完再取值往往能拿到；如果在 TDZ 里读 `let/const` 导出会抛 `ReferenceError`。
- Q: 为什么 ESM 能做 tree-shaking，CJS 不行？
  A: ESM 的 `import`/`export` 是静态语法，打包器在编译期就能画出模块图，确认 `export function foo` 没人用就删。CJS 的 `require` 是函数调用，路径可以是变量，导出形状要跑完才知道，静态分析不敢删。`module.exports = { foo }` 这种形状有的打包器能猜，但一遇到条件 `require` 就放弃。

## 自己的易错点 / 之前答崩过的地方

- 把 `exports = {}` 当默认导出，调试半天才发现外面拿到空对象。
- 以为 ESM `export default` 和 `module.exports =` 完全互通。CJS `require` 一个 ESM 默认导出，经常要 `.default`。
- 把 `require.cache` 清掉就以为单例断了。如果别人手里还握着旧的 exports 引用，对象还在。
- Node 18+ 可以在 ESM 里同步 `import` 部分内置模块，但业务代码别依赖这个。
