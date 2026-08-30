# OAuth2与单点登录SSO

## 核心回答（面试口述版，1 分钟能讲完）

OAuth2 解决「让第三方在不拿到用户密码的前提下访问我的资源」。授权码模式最常见：浏览器跳到授权服务器登录，带回一次性 `code`，客户端拿 `code + client_secret` 在服务端换 token，token 不走 URL。SSO 解决「多个自家系统只登一次」：中心登录签发 ticket / 会话，业务系统用它换本地登录态。第三方登录是 OAuth2；公司内部统一门户是 SSO，两者常叠在一起（用 OIDC，OAuth2 + ID Token）。

## 展开

1. OAuth2 授权码模式流程

   角色：资源拥有者、客户端、授权服务器、资源服务器。
   1. 前端跳 ` /authorize?client_id&redirect_uri&scope&state&response_type=code`
   2. 用户登录并同意
   3. 回调 `redirect_uri?code=...&state=...`
   4. 后端 `POST /token` 用 code、secret 换 `access_token`（可带 `refresh_token`）
   5. 带 Bearer 访问资源服务器

   隐式模式把 token 放 hash，不适合现在的 SPA。客户端模式没有用户。密码模式把密码给客户端，已不推荐。

2. SSO 的实现思路（CAS/共享 token）

   CAS：浏览器访问 app1，没登录则跳 CAS；CAS 有 TGC Cookie 则发一次性 ST，app1 回服务器验 ST，建立自己的 session。app2 同样跳 CAS，TGC 还在就不用再输密码。
   共享父域 Cookie：`sso.example.com` 的 Cookie 给 `*.example.com`。跨主域要用中心跳转，不能直接共享 Cookie。
   OIDC：授权码回来的同时有 JWT 格式的 ID Token，里面是用户身份。

3. 第三方登录的安全点（state 防 CSRF）

   `state` 是随机串，存在 session 或前端 cookie，回调必须对上，否则攻击者拿自己的 code 绑到受害者账号。`redirect_uri` 必须白名单精确匹配。code 一次性、短 TTL。PKCE（S256）给公钥客户端（APP、SPA）防 code 拦截。token 存 HttpOnly，注意 `scope` 最小化。

## 延伸

- 相关题：鉴权 JWT 与 Session。OIDC 的 ID Token 常常就是 JWT。
- 对比：CAS 靠中心跳转发 ticket；同主域可以共享 Cookie，跨主域必须跳 `sso.com`。
- 加码：PKCE 给 SPA 防 code 被拦。`client_secret` 不能打进前端包。OAuth2 管授权，你是谁是 OIDC 那一层。

## 代码 / 例子

```text
302 https://auth.example.com/authorize?
  client_id=app&redirect_uri=https://app/cb&response_type=code&state=r1&scope=openid

GET /cb?code=spl1&state=r1
POST /token  code=spl1&client_secret=...  → access_token, id_token
```

## 常见追问

- Q: 授权码模式为什么要多一步 code 换 token？
  A: 让 token 走服务器对服务器的 POST，不出现在浏览器历史、Referer、日志里的 URL。换 token 时校验 `client_secret` 或 PKCE，证明回调来自真正的客户端。若直接把 access_token 放在 redirect（隐式模式），XSS 和浏览器插件更容易偷。
- Q: SSO 在多个不同域名下怎么共享登录态？
  A: Cookie 不能跨主域。统一跳到 `sso.com`，用它的 Cookie 当总登录态，各业务域拿 ticket 在后端换自己的 Cookie。前端还能用隐藏 iframe + postMessage（第三方 Cookie 被砍后这条越来越难），现在主流通跳转。退出要通知各域清本地 session（CAS logout 回调用）。

## 自己的易错点 / 之前答崩过的地方

- 把 OAuth2 讲成认证协议。OAuth2 是授权，身份认证是 OIDC 那一层 ID Token。
- `state` 写成固定 `xyz`，CSRF 绑号。
- 用授权码模式却把 `client_secret` 打进前端包。
