# Cookie / Session / LocalStorage / SessionStorage 的区别

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

| 维度 | Cookie | LocalStorage | SessionStorage | Session（服务器端） |
| --- | --- | --- | --- | --- |
| 存储大小 | | | | — |
| 生命周期 | | | | 服务器决定 |
| 与请求一起发？ | | 否 | 否 | — |
| 作用域 | | | 仅当前标签页 | 按用户 |
| 数据位置 | | | | 服务端（Redis/内存/DB） |
| 安全相关属性 | HttpOnly / Secure / SameSite | — | — | 依赖 SessionId 载体 |
| 典型用途 | 登录态、追踪、CSRF 防护 | 长期本地偏好 | 表单草稿 / 标签页状态 | 登录态、购物车 |

## 常见追问

- Q: Cookie 的 Domain / Path / Expires / Max-Age 各有什么用？
  A:
- Q: Session 的实现机制 —— SessionID 是怎么在客户端和服务端之间传递的？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
