# XSS 与 CSRF 攻击及其防范

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

### XSS（跨站脚本攻击）

1. 三类：存储型 / 反射型 / DOM 型，分别的攻击路径
2. 防范：转义（& < > " ' /）、CSP 策略、HttpOnly Cookie、输入过滤、输出编码、innerHTML/textContent 的选择、框架自带的防护（Vue / React 自动转义）

### CSRF（跨站请求伪造）

1. 攻击原理：利用用户已登录状态，通过第三方站点自动发起请求
2. 三个必要条件：用户登录态有效、浏览器自动带 Cookie、目标接口无 CSRF 校验
3. 防范：Token（放到 Header，不是 Cookie）、SameSite Cookie（Strict / Lax / None）、Referer 校验、验证码 / 二次确认、CSRF Token（双重提交 Cookie）

## 常见追问

- Q: SameSite=None 时必须同时开启什么？（Secure，即 HTTPS）
  A:
- Q: 开启 HttpOnly 的 Cookie 能被 XSS 偷走吗？能被 CSRF 利用吗？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
