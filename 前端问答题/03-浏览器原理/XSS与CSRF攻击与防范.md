# XSS 与 CSRF 攻击及其防范

## 核心回答（面试口述版，1 分钟能讲完）

XSS 是往页面里塞脚本，跑在用户的源里，能偷 cookie、改 DOM、冒充用户发请求。
三类：存进数据库的存储型、URL 参数反射回来的反射型、不经过服务器的 DOM 型。
防 XSS：输出编码、CSP、Cookie 开 HttpOnly、React/Vue 默认文本转义、别把用户输入塞进 `innerHTML`。
CSRF 是用户已经登录，攻击者的页面让浏览器自动带着 cookie 打你的接口。用户无感知。
防 CSRF：SameSite Cookie（Lax/Strict）、接口校验 CSRF Token（放 Header）、关键操作二次确认。
HttpOnly 防 XSS 偷 cookie，挡不住 CSRF，因为 CSRF 不需要读 cookie，浏览器会自己带。

## 展开

### XSS（跨站脚本攻击）

1. 三类：存储型 / 反射型 / DOM 型，分别的攻击路径

- 存储型：评论、昵称写入 DB，别人打开详情页脚本执行。危害最大，一次写入攻击所有访客。
- 反射型：`/search?q=<script>...`，服务端把 q 拼进 HTML 返回。要诱骗受害者点开链接。
- DOM 型：前端用 `location.hash`、`innerHTML` 把 URL 片段写进页面，服务端日志都看不到。SPA 里很常见。

2. 防范：转义（& < > " ' /）、CSP 策略、HttpOnly Cookie、输入过滤、输出编码、innerHTML/textContent 的选择、框架自带的防护（Vue / React 自动转义）

输出编码是正道：HTML 上下文转 `< > & " '`，JS 上下文、URL 上下文规则不同。输入过滤当辅助，黑名单总会漏。
CSP：`Content-Security-Policy: default-src 'self'; script-src 'self'`，禁掉行内脚本和陌生域。`strict-dynamic` + nonce 更严。
Cookie：`HttpOnly` 让 `document.cookie` 读不到；`Secure` 只走 HTTPS；`SameSite` 主要防 CSRF。
DOM：用 `textContent` / `setAttribute`，不用 `innerHTML`、`document.write`、`eval`。
Vue 默认文本插值会转义，`v-html` 是口子。React JSX 文本转义，`dangerouslySetInnerHTML` 是口子。

### CSRF（跨站请求伪造）

1. 攻击原理：利用用户已登录状态，通过第三方站点自动发起请求

用户登录了 `bank.com`，cookie 还在。打开 `evil.com`，页面里一个自动提交的表单 POST 到 `bank.com/transfer`。浏览器按同源策略会带上 bank.com 的 cookie。银行以为是用户自己点的。

2. 三个必要条件：用户登录态有效、浏览器自动带 Cookie、目标接口无 CSRF 校验

少一条就做不成。Token 放 Header、SameSite、不拿 cookie 当唯一凭证（改用 Authorization Header）都能拆掉条件。

3. 防范：Token（放到 Header，不是 Cookie）、SameSite Cookie（Strict / Lax / None）、Referer 校验、验证码 / 二次确认、CSRF Token（双重提交 Cookie）

- SameSite=Lax：默认，跨站导航 GET 带 cookie，跨站 POST 不带。够挡住多数 CSRF。
- Strict：跨站完全不带，从外链进自己站点第一次请求也没 cookie，体验差一些。
- None：跨站也带，必须配 Secure。给跨站 iframe、第三方支付用。
- CSRF Token：页面里藏随机 token，提交时放 Header。攻击站读不到你页面 DOM。双重提交是 cookie 一份、header 一份，服务端比对。
- Referer / Origin 校验：简单但能被关掉 Referer 的客户端绕过，当辅助。
- 转账、改密码加验证码或密码二次确认。

## 常见追问

- Q: SameSite=None 时必须同时开启什么？（Secure，即 HTTPS）
  A: 必须 `Secure`。Chrome 80 之后 `SameSite=None` 没有 Secure 会被拒。HTTP 站点设不了 None。现代浏览器没写 SameSite 时默认 Lax。

- Q: 开启 HttpOnly 的 Cookie 能被 XSS 偷走吗？能被 CSRF 利用吗？
  A: JS 读不了这份 cookie，常见的 `document.cookie` 偷盗不行。但 XSS 已经能在你的页面里发请求，等于拿着登录态为所欲为，不一定非要偷 cookie。CSRF 仍然能利用它：CSRF 靠浏览器自动带 cookie，不需要 JS 读。所以 HttpOnly 和 CSRF 防护是两件事，都要开。

## 自己的易错点 / 之前答崩过的地方

我以前说「HttpOnly 能防 CSRF」。完全搞反。HttpOnly 防的是 XSS 读 cookie。
Vue/React 我以为绝对没 XSS。`v-html`、`dangerouslySetInnerHTML`、把用户输入塞进 `href="javascript:"` 照样中。
SameSite=Lax 挡不住「诱骗用户点链接触发 GET 删除」。改数据的接口别用 GET。
