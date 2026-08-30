# 输入 URL 到页面加载的全过程

## 核心回答（面试口述版，1 分钟能讲完）

按链路说：解析 URL → 查缓存 → DNS → TCP → TLS → 发 HTTP → 收响应 → 渲染。
Chrome 里浏览器进程接到输入，网络进程去拉数据，渲染进程负责把 HTML 变成像素。
缓存先看强缓存，命中直接用；不中再带条件头走协商，304 用本地，200 用新的。
DNS 可能走到 CDN 的 CNAME，GSLB 给你最近的边缘节点。
HTTPS 先 TCP 三次握手，再 TLS（1.3 通常 1 个 RTT）。
HTML 回来后提交给渲染进程：DOM、CSSOM、Render Tree、布局、绘制、合成。
`DOMContentLoaded` 是 HTML 解析完（含 defer 脚本），`load` 是图片等资源也完了。

## 展开（按顺序一步步列）

1. URL 解析 & 合法性检查

拆协议、主机、端口、路径、query、hash。没写协议补 `https://`。非法字符、超长、javascript: 这类由浏览器按规则拦或编码。hash 不发给服务器。

2. 浏览器进程 → 网络进程发起请求

浏览器进程（UI）判断是搜索词还是 URL。导航交给网络进程。跨站通常会新开渲染进程（站点隔离）。

3. 强缓存 / 协商缓存判断

先内存缓存，再磁盘。`Cache-Control: max-age` / `Expires` 没过期，直接 200（from disk/memory），不出网。过期了带 `If-None-Match` / `If-Modified-Since` 去问服务器。

4. DNS 解析（含 CDN）→ 建立 TCP → HTTPS 握手

浏览器 DNS 缓存 → OS 缓存 → hosts → 递归解析。CDN 场景权威 DNS 返回 CNAME，再由 CDN 调度出边缘 IP。然后 TCP 三次握手；HTTPS 再做 TLS，1.3 可以 1 RTT，会话复用 0 RTT。

5. 服务器返回响应，网络进程接收响应体

看状态码和响应头。`Content-Type`、`Content-Encoding`（gzip/br）、`Set-Cookie` 在这里处理。体可能分块传输。

6. 301/302 跳转处理

3xx 带 `Location`，网络进程跟跳转，有上限（一般 20 次）。301/308 浏览器会记住；302/307 偏临时。POST 被 302 可能变成 GET，307/308 保住方法和 body。

7. 判断响应类型（下载 / HTML / 其他）

`Content-Disposition: attachment` 或类型是 zip/pdf 可能走下载，不进渲染进程。`text/html` 才提交文档。

8. 提交文档 → 浏览器进程通知**渲染进程**接手

网络进程把数据交给渲染进程，导航提交。之后文档的生命周期在渲染进程里。

9. 渲染进程内部：解析 HTML 生成 DOM → 解析 CSS 生成 CSSOM → 合并 Render Tree → 布局 → 绘制 → 合成 → 显示

HTML 一边收一边解析。CSS 下完建成 CSSOM。两者合成 Render Tree（`display:none` 不进）。Layout 算几何，Paint 画图层，Composite 交给 GPU 合成，最后上屏。

10. Defer / async 脚本、JS 阻塞解析的细节

普通 `<script src>`：解析停，下载并执行完再继续。`async`：下载不挡解析，下完立刻执行（顺序不保证），挡解析。`defer`：下载不挡解析，DOM 建完按书写顺序执行，在 `DOMContentLoaded` 之前。`type="module"` 默认 defer。JS 能改 DOM，所以解析器必须等它。

11. 首屏 / DOMContentLoaded / Load 三个事件什么时候触发

首屏（FP/FCP）是第一次把像素画出来，可能早于 DCL。
`DOMContentLoaded`：HTML 解析完 + defer/module 跑完，不等图片、不等 stylesheet 本身（但 stylesheet 后面的同步脚本会等 CSS）。
`load`：这个文档依赖的图片、样式、子 iframe 都加载完。性能指标现在更看 LCP，不一定等 load。

## 自己的易错点 / 之前答崩过的地方

我以前把 DNS、TCP、TLS 顺序说反，或漏掉缓存这一步。缓存命中根本不会去 DNS。
DCL 和 load 我分不清。图片很大时 load 会晚很多，DCL 早就能绑事件。
说「浏览器单进程」已经过时。现在至少浏览器进程 / 网络进程 / 渲染进程 / GPU 进程。
