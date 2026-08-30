# Cookie / Session / LocalStorage / SessionStorage 的区别

## 核心回答（面试口述版，1 分钟能讲完）

Cookie 是浏览器存的小段数据，默认每次请求自动带给对应域名，体积大约 4KB。
LocalStorage 大约 5MB，同源持久存，关浏览器还在，不跟请求走。
SessionStorage 也大约 5MB，只活在当前标签页，关页就没，适合草稿。
服务端 Session 是服务器上的一份用户数据，客户端只拿一个 SessionId（常放 Cookie 里）。
登录态现在常见两种：SessionId + Cookie（可 HttpOnly），或 Token 放内存 / 自己写的存储。
别把 Token 乱塞 LocalStorage，XSS 能直接读。敏感信息优先 HttpOnly Cookie。

## 展开

| 维度 | Cookie | LocalStorage | SessionStorage | Session（服务器端） |
| --- | --- | --- | --- | --- |
| 存储大小 | ~4KB / 条，单域几十条 | ~5MB | ~5MB | 看服务器（内存 / Redis） |
| 生命周期 | Expires / Max-Age；不设就是会话 Cookie | 永久，直到手动清或代码删 | 关标签页（含恢复的话有的浏览器会还原） | 服务器决定，滑动过期常见 |
| 与请求一起发？ | 是（符合 Domain/Path 就会带） | 否 | 否 | — |
| 作用域 | Domain + Path，且要同源策略 | 同源 | 当前标签页 + 同源 | 按用户 / SessionId |
| 数据位置 | 浏览器 | 浏览器 | 浏览器 | 服务端（Redis/内存/DB） |
| 安全相关属性 | HttpOnly / Secure / SameSite | XSS 可直接读 | XSS 可直接读 | 依赖 SessionId 载体 |
| 典型用途 | 登录态、追踪、CSRF 防护 | 长期本地偏好、主题 | 表单草稿 / 标签页状态 | 登录态、购物车 |

Cookie 每次请求都带，多了会撑请求头。LocalStorage 是同步 API，主线程读大 JSON 会卡。IndexedDB 才是大数据异步方案。

## 延伸

- 相关题：XSS/CSRF、跨域 `credentials`、JWT vs Session。
- 对比题：会话 Cookie 关浏览器清；SessionStorage 关的是标签页。Cookie 自动随请求走，Web Storage 不会。
- 面试加码：登录态优先 HttpOnly Cookie。Token 别塞 LocalStorage，XSS 能直接读。大数据用 IndexedDB。

## 常见追问

- Q: Cookie 的 Domain / Path / Expires / Max-Age 各有什么用？
  A: `Domain=.example.com` 让子域共享；不设则仅当前主机，不含子域。`Path=/api` 只有这个路径前缀的请求才带。`Expires` 是绝对时间，`Max-Age` 是秒数，同时出现听 Max-Age。都不设就是会话 Cookie，关浏览器清掉（Chrome 可能把会话 Cookie 和标签恢复绑在一起，不完全清）。再配 `Secure`、`HttpOnly`、`SameSite`。

- Q: Session 的实现机制 —— SessionID 是怎么在客户端和服务端之间传递的？
  A: 登录成功，服务器生成随机 SessionId，存一份 `{sid: userInfo}` 在 Redis，`Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax`。之后请求浏览器自动带 Cookie，服务器拿 sid 查会话。也可以放 URL 查询串（老做法，会泄漏到 Referer）。SPA + 多端更常见 JWT 放 Authorization Header，服务端无状态，但撤销和续期要另做。

## 自己的易错点 / 之前答崩过的地方

我把 SessionStorage 说成「会话级 Cookie」。它跟 Cookie 无关，关的是标签页，不是浏览器进程。
LocalStorage 存 token 我以前当最佳实践。XSS 一来 token 就被读走，HttpOnly Cookie 至少 JS 偷不走。
Cookie 容量当无限用，结果请求头被打到 8KB 以上，网关直接 400。
