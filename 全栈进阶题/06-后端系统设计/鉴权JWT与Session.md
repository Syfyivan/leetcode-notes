# 鉴权JWT与Session

## 核心回答（面试口述版，1 分钟能讲完）

Session 方案：登录后服务端存会话，浏览器拿 `Set-Cookie: sid=...`，之后请求自动带上，服务端查 Redis。有状态，踢人就是删 Redis 那个 key。JWT：服务端不存会话，把 `{uid, exp}` 做进 payload，用 HMAC（HS256）或 RSA（RS256）签名，客户端每次带 `Authorization: Bearer ...`。无状态好扩容，坏处是签发之后没法单方面作废，除非加黑名单或把 TTL 做得很短再配 Refresh Token。

## 展开

1. Session-Cookie 有状态 vs JWT 无状态

   Session：数据在服务器。多机必须共享存储，否则用户打到另一台就掉登录。Cookie 默认同源、可 `HttpOnly`、`Secure`、`SameSite=Lax` 防 XSS 偷和 CSRF。
   JWT：数据在客户端。网关本地验签就能过，不碰存储。适合微服务，代价是 payload 别塞敏感信息（Base64 不是加密），体积比 sid 大，进 Cookie 要注意 4KB 上限。

2. JWT 的三段结构、签名验证

   `header.payload.signature`，每段 Base64URL。
   header：`{"alg":"HS256","typ":"JWT"}`。
   payload：注册字段 `sub`、`exp`、`iat`、`nbf`，加上自定义 uid、roles。
   签名：`HMACSHA256(base64(header)+"."+base64(payload), secret)`。验签过了还要看 `exp`。RS256 用私钥签、网关持公钥验，密钥不必分发到每个服务。改 alg 成 none 的攻击：验签库必须白名单算法。

3. JWT 的痛点（无法主动失效、续签）

   标准 JWT 是发后不管。改密码、封号、登出，旧 token 在 exp 前仍可用。续签硬拉 `exp` 等于发一张新票。常见做法：Access Token 15 分钟 + Refresh Token 7 天；刷新时看用户状态；登出把 jti 进 Redis 黑名单直到自然过期。黑名单一加，JWT 又变回「有一点点状态」。

## 延伸

- 相关题：OAuth2。Access + Refresh 和授权码换 token 经常一起出现。
- 对比：HS256 共享密钥；RS256 网关持公钥验，密钥不用发到每个服务。
- 加码：Refresh 放 HttpOnly Cookie，Access 放内存。轮转时旧票被用一次视为偷盗，整族踢掉。

## 代码 / 例子

```text
# 登录
SET session:3f2a '{"uid":9}' EX 1800
Set-Cookie: sid=3f2a; HttpOnly; Secure; SameSite=Lax

# JWT
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5IiwiZXhwIjoxNzAwfQ.sig
```

## 常见追问

- Q: JWT 怎么做登出/踢人？
  A: 三种：1) Access 极短，登出只作废 Refresh（Refresh 存 Redis，删 key 即踢）。2) 黑名单：把 jti 或 token 哈希写入 Redis，TTL=剩余 exp，网关先查名单。3) 用户级 `tokenVersion`，踢人时 +1，payload 里版本对不上就拒。没有服务端存储就做不到立刻踢，这是 JWT 的结构限制。
- Q: Access Token + Refresh Token 的配合流程？
  A: 登录发一对。业务请求只带 Access。Access 过期，前端用 Refresh 打 `/refresh`，校验 Refresh 未吊销再发新 Access（可选择 Refresh 轮转，旧的立刻失效）。Refresh 放 HttpOnly Cookie，Access 放内存，降低 XSS 一次偷走长期凭证的风险。轮转时要防重放：旧 Refresh 被用一次就视为偷盗，踢掉整个家族。

## 自己的易错点 / 之前答崩过的地方

- 把 JWT 放 LocalStorage，XSS 一偷就有完整登录态。敏感票优先 Cookie + HttpOnly。
- 只验签名不看 `exp`，过期 token 仍能进。
- 说 JWT 绝对无状态，同时又要秒级踢人，两套需求互相打架，必须承认加了黑名单。
