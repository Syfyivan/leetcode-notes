# ES Module 与 CommonJS 的区别

## 核心回答（面试口述版，1 分钟能讲完）

CJS 是 Node 老模块：`require` / `module.exports`，运行时加载，能写在 if 里。
ESM 是语言标准：`import` / `export`，必须写在顶层，路径是字符串字面量，编译期就能画出依赖图。
CJS 导出基本类型是值拷贝，那边改了，你这边还是旧的。ESM 是绑定，源变了你这边跟着变。
Tree Shaking 靠 ESM 的静态结构。CJS 分析不出来谁被用到。
浏览器原生只吃 ESM。Node 14+ 能跑 ESM，文件用 `.mjs` 或 `package.json` 里 `"type": "module"`。
两边混用很痛：ESM 能同步 import CJS，CJS 加载 ESM 只能 `import()`。

## 展开

| 维度 | CommonJS（require / module.exports） | ES Module（import / export） |
| --- | --- | --- |
| 加载时机 | **运行时**同步加载（可放在 if 里、可动态变量路径） | **编译时**静态分析（必须在顶层、路径必须字符串字面量，tree-shaking 的基础） |
| 导出方式 | **值拷贝**（基本类型导出后原变量变，导入方不变） | **值引用**（引用绑定，原始值变，导入处同步变） |
| 加载位置 | 只能在 Node 环境（浏览器不原生支持，得打包） | 浏览器 & Node 14.8+ 原生支持；Node 里要 `.mjs` 或 `package.json` 设 `"type": "module"` |
| this 指向 | module 本身 | undefined（严格模式） |
| 动态导入 | 只能静态路径字符串 | 标准：`import()` 动态导入，返回 Promise |
| 默认导出处理 | module.exports 直接赋值 | `export default` 其实是语法糖，导出一个叫 default 的具名导出 |

CJS 的 `require` 有缓存，同一个路径只执行一次，之后拿 `module.exports` 快照。ESM 模块也是单例，但导出是实时绑定。
对象导出在 CJS 里是引用，改属性两边都看见；改的是绑定本身才看拷贝差异。别笼统说「CJS 全是拷贝」。

## 代码 / 例子

```js
// counter.cjs
let n = 0;
module.exports = { n, inc: () => { n++; } };

// counter.mjs
export let n = 0;
export function inc() { n++; }

// CJS 导入
const c = require('./counter.cjs');
c.inc();
console.log(c.n); // 仍是 0，n 是拷贝；inc 改的是模块内部那份

// ESM 导入
import { n, inc } from './counter.mjs';
inc();
console.log(n); // 1，绑定跟着变
```

## 常见追问

- Q: 为什么 ESM 能 Tree Shaking 而 CJS 很难？
  A: ESM 的 import/export 是语法，打包器不用跑代码就知道 `import { foo }` 只用了 foo。CJS 的 `require(path)` 路径可能是变量，`module.exports` 可能在运行时被改，分析器只能当「整个模块都有副作用」。webpack 对部分 CJS 做启发式，不可靠。库要摇树请给 ESM 入口（`package.json` 的 `module` / `exports`）。

- Q: 循环依赖下 CJS 和 ESM 各自的行为？
  A: CJS：A require B，B 再 require A 时，A 还没跑完，B 拿到的是当时的 `module.exports`（可能是 `{}`），属性后补才有。ESM：先建好所有模块的绑定，再执行。A 执行到一半 B 来读 A 的导出，只要那个绑定已经初始化就行，读到的是 live 值。两边循环都恶心，ESM 稍微可预期一点，仍然该拆模块。

## 自己的易错点 / 之前答崩过的地方

我说「CJS 导出对象也是拷贝」，面试官改了属性两边都变，我当场卡壳。拷贝的是绑定，对象内容还是同一份堆。
`import { foo } from './a'` 我写进 if。语法错误。动态只能 `await import()`。
Node 里 `.js` 默认 CJS，突然 `import` 报错。要 `"type": "module"` 或改 `.mjs`。
