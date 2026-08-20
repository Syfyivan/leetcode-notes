# CDN 原理

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. CDN 是什么？（内容分发网络：把源站资源缓存到全球多个边缘节点，用户就近取）
2. 核心收益：降低回源压力、降低用户访问延迟、抗峰值流量、隐藏源站 IP（抗 DDoS 一层防护）
3. 访问流程：
   - 用户请求 URL → 本地 DNS → 权威 DNS 返回 **CNAME 到 CDN 的调度域名**
   - 再查 CDN 调度域名 → **CDN 的 GSLB（全局负载均衡）**根据用户 IP / 运营商 / 节点负载返回**最近的边缘节点 IP**
   - 用户请求该边缘节点：
     - **命中缓存**：直接返回
     - **未命中**：逐层回源（父节点 / 区域节点 / 源站），拿到资源写入自己缓存再返回
4. 缓存策略：
   - 静态资源 `Cache-Control: max-age + s-maxage`（s-maxage 专门给 CDN 用，优先级高于 max-age）
   - 动态内容不缓存
   - 回源校验：ETag / Last-Modified
   - 资源更新：文件名 hash 让 URL 变了自然走新缓存；或手动刷新缓存 / Purge

## 常见追问

- Q: CDN 的 GSLB 怎么选节点？（DNS 解析 + Anycast IP + HTTP 302 重定向 等调度方式）
  A:
- Q: s-maxage 和 max-age 有什么不同？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
