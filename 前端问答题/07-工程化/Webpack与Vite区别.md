# Webpack 与 Vite 的区别

## 核心回答（面试口述版，1 分钟能讲完）

Webpack 开发时先把整张依赖图打成 bundle 再启动，项目一大，冷启动和热更新都慢。
Vite 开发时用浏览器原生 ESM：启动只做依赖预构建，源码按需编译，点到哪个页面才转哪个文件。
Vite 预构建用 esbuild（Go）把 node_modules 里的 CJS 转成 ESM，并打成少数几个文件，避免几百个请求。
生产环境 Vite 默认交给 Rollup 打包（代码分割、摇树成熟）。Webpack 生产仍走自己的 chunk 算法。
2025 之后 Vite 在往 Rolldown（Rust）迁，方向是开发和生产同一套打包器。面试说「开发 ESM + 生产 Rollup」仍然成立。
配置上 Vite 约定多、插件兼容 Rollup；Webpack loader/plugin 生态更大，老项目、微前端、复杂自定义更常见 Webpack。

## 展开

| 维度 | Webpack | Vite |
| --- | --- | --- |
| 开发模式启动原理 | 先打包所有模块 → 再启动 dev-server | 利用浏览器原生 ESM，按需编译；冷启动快、大项目体验拉开明显差距 |
| 开发模式下的 HMR | 全量 Rebuild 模块 + 热替换 | 精确使模块失效 + 重新请求，速度与模块数量解耦 |
| 生产构建 | Webpack 自己的打包（5.x 也支持 esbuild-loader + Terser） | **Rollup** 做生产打包（代码分割、tree-shaking 更成熟）+ esbuild 做预构建 |
| 预构建（依赖预打包） | 不需要 | **必须**：把 CommonJS / UMD 转 ESM；把多文件的包打平减少请求瀑布 |
| 插件生态 | 极成熟 | 兼容 Rollup 插件 + Vite 专用插件，还在追赶 |
| 配置复杂度 | 高（loader + plugin + optimization 全家桶） | 低（大部分零配置 + 强约定） |
| 浏览器兼容 | 强（可配置低版本目标） | 默认现代浏览器，需要加 @vitejs/plugin-legacy |

Webpack 5 有持久化缓存、模块联邦，不是「已被淘汰」。大型存量、SSR 深度定制、Module Federation 仍经常是 Webpack。新项目 2024-2026 校招默认 Vite。

## 常见追问

- Q: Vite 的「依赖预构建」做了哪两件事？为什么要做？
  A: ① 把 CJS/UMD 转成 ESM，不然浏览器 `import` 吃不了 `module.exports`。② 把 lodash 这种几百个小文件打成一两个，避免请求瀑布。预构建结果缓存在 `node_modules/.vite`，依赖没变就复用。源码不预构建，保持按需。

- Q: esbuild 那么快（Go 写的），为什么 Vite 生产不用它打包？（代码分割、CSS 处理还不如 Rollup 成熟）
  A: esbuild 的 code split、CSS 作用域、一堆 Rollup 插件生态当时都不齐。生产要稳定的 chunk 划分、tree-shake、手册级别的输出控制，Rollup 更熟。esbuild 负责 dev 转译和 dep 预构建已经够赚。Rolldown 目标就是把这一层换成 Rust 实现、对齐 Rollup API，以后可能会统一。

## 自己的易错点 / 之前答崩过的地方

我说 Vite 生产也是 esbuild 打包。被追问 chunk 命名就露馅。
把「启动快」说成「Vite 不用打包」。开发时 npm 包照样预打包，源码是按需转译。
Webpack 的 `file-loader` 思路搬到 Vite，忘了 `import url from './x.png?url'` 这种约定，资源处理方式不一样。
