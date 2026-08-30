# CDN 原理

## 核心回答（面试口述版，1 分钟能讲完）

CDN 把静态资源缓存在离用户近的边缘节点，用户就近下载，源站少挨打。
访问时本地 DNS 最终拿到的是 CDN 的调度结果：按 IP 归属、运营商、节点负载挑一个最近的。
边缘有缓存就直接回；没有就回源（可能先问父节点），写入自己再给用户。
静态文件用 `Cache-Control`，给 CDN 单独的 `s-maxage` 往往比浏览器的 `max-age` 更长。
更新靠文件名 hash：URL 变了等于新缓存键。紧急下线用 purge 刷新。
顺便能挡住一部分 DDoS，源站 IP 不暴露。动态 HTML 一般不缓存，或只缓存几秒。

## 展开

1. CDN 是什么？（内容分发网络：把源站资源缓存到全球多个边缘节点，用户就近取）

节点是反向代理 + 缓存。配置 CNAME 把 `static.example.com` 指到 CDN 域名，之后解析权交给 CDN。

2. 核心收益：降低回源压力、降低用户访问延迟、抗峰值流量、隐藏源站 IP（抗 DDoS 一层防护）

首字节时间（TTFB）和下载时间都降。大促静态资源几乎不打源站。源站只处理动态接口和未命中的回源。

3. 访问流程：
   - 用户请求 URL → 本地 DNS → 权威 DNS 返回 **CNAME 到 CDN 的调度域名**
   - 再查 CDN 调度域名 → **CDN 的 GSLB（全局负载均衡）**根据用户 IP / 运营商 / 节点负载返回**最近的边缘节点 IP**
   - 用户请求该边缘节点：
     - **命中缓存**：直接返回
     - **未命中**：逐层回源（父节点 / 区域节点 / 源站），拿到资源写入自己缓存再返回

递归 DNS 看到的用户 IP 可能是 Local DNS 的 IP，不是终端 IP，调度会偶尔不准。Anycast 用同一 IP 从路由层引到近的机房，能补这层。

4. 缓存策略：
   - 静态资源 `Cache-Control: max-age + s-maxage`（s-maxage 专门给 CDN 用，优先级高于 max-age）
   - 动态内容不缓存
   - 回源校验：ETag / Last-Modified
   - 资源更新：文件名 hash 让 URL 变了自然走新缓存；或手动刷新缓存 / Purge

带 hash 的 js/css 可以 `s-maxage=31536000, immutable`。HTML 入口 `s-maxage=60` 或 `no-cache`。Set-Cookie 的响应默认很多 CDN 不缓存。`Vary: Accept-Encoding` 常见。

## 常见追问

- Q: CDN 的 GSLB 怎么选节点？（DNS 解析 + Anycast IP + HTTP 302 重定向 等调度方式）
  A: 最常见是 DNS 调度：GSLB 当权威 DNS，按请求方 IP 返回一个 A 记录。Anycast：全球通告同一 IP，BGP 把包送到最近的 POP。还有 302 把用户踢到更合适的主机，多一次 RTT，现在少用。实际会叠加：DNS 给出 Anycast IP，机房内部再负载均衡。

- Q: s-maxage 和 max-age 有什么不同？
  A: `max-age` 浏览器和中间缓存都看。`s-maxage` 只给共享缓存（CDN、代理），优先级更高。典型：`Cache-Control: max-age=600, s-maxage=86400`，用户 10 分钟后会跟 CDN 再验证，CDN 对源站可以一天再回源一次。HTML 反过来：浏览器短缓存，CDN 更短或不缓存。

## 自己的易错点 / 之前答崩过的地方

我以为改了源站文件，CDN 马上全网更新。没有 purge、URL 又没变，边缘还是旧的，要等 TTL。
回源我当成用户直接打源站。用户始终只打边缘，由边缘去源站。
把 CDN 当银弹缓存接口。带登录态的动态 JSON 一缓存就串用户，必须 `private` / `no-store`。
