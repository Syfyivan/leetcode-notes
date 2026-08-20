# Webpack 与 Vite 的区别

## 核心回答（面试口述版，1 分钟能讲完）

TODO

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

## 常见追问

- Q: Vite 的「依赖预构建」做了哪两件事？为什么要做？
  A:
- Q: esbuild 那么快（Go 写的），为什么 Vite 生产不用它打包？（代码分割、CSS 处理还不如 Rollup 成熟）
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
