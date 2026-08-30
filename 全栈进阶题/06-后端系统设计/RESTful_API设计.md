# RESTful / API设计

## 核心回答（面试口述版，1 分钟能讲完）

REST 把 URL 当成资源，用 HTTP 动词表达动作：`GET /users/9` 读，`POST /users` 建，`PUT /users/9` 整份替换，`PATCH /users/9` 改部分，`DELETE /users/9` 删。路径用名词复数，不用 `/getUser`。状态码别全 200：201 创建，204 无 body 删除，400 参数，401 未登录，403 没权限，404 没有，409 冲突，429 限流，500 锅在服务器。版本、分页、幂等要在设计期定。

## 展开

1. 资源、名词化 URL、HTTP 动词语义

   集合 `/orders`，实例 `/orders/88`，子资源 `/orders/88/items`。过滤用 query：`GET /orders?status=open&page=2`。动作不像资源时（「取消订单」）用子资源 `POST /orders/88/cancellation` 或 PATCH 状态字段，少发明 `POST /cancelOrder`。

2. 状态码的正确使用

   2xx 成功，4xx 客户端，5xx 服务端。创建返回 201 + `Location`。校验失败 422 或 400。冲突（唯一键）409。鉴权：没票 401，有票不够格 403。限流 429 + `Retry-After`。body 再给业务码和人能读的 message。

3. 版本管理、分页、幂等

   版本：`/v1/users` 或 `Accept: application/vnd.api.v1+json`。破坏性变更才升版本。
   分页：offset 简单但深页慢；`?cursor=xxx&limit=20` 稳。返回 `next_cursor`。
   幂等：PUT/DELETE 天生幂等；POST 创建要 `Idempotency-Key`。GET 必须无副作用。

## 代码 / 例子

```text
POST /v1/orders
Idempotency-Key: 8c1a...
201 Created
Location: /v1/orders/88
{ "id": 88, "status": "created" }

GET /v1/orders?cursor=88&limit=20
200 { "data": [...], "next": "68" }

PATCH /v1/orders/88
{ "status": "cancelled" }
200
```

## 常见追问

- Q: PUT 和 PATCH 的区别？哪个幂等？
  A: PUT 用完整资源替换目标，同一个 body 打 N 次结果一样，幂等。PATCH 只寄补丁（JSON Merge Patch 或 JSON Patch RFC 6902）。PATCH 语义上不保证幂等，例如 patch 是「库存 -1」；设计成「把库存设为 7」就幂等。能用状态覆盖就别用相对增量。
- Q: REST 和 RPC/GraphQL 的取舍？
  A: 对外 Open API、缓存、CDN、权限按资源切，用 REST。内部服务低延迟、强类型、一个动作横跨多个资源，gRPC 更合适。前端要一次拉图谱、字段各页面不同，GraphQL 能减少 round trip，但 N+1、缓存、文件上传都要额外方案。校招项目别三套都上，对外 REST 够了。

## 自己的易错点 / 之前答崩过的地方

- `GET /users?id=9&action=delete` 用 GET 改数据，浏览器预加载、缓存、重试会帮你删两次。
- 成功失败都 200，错误只写在 `{code:1}`，网关和监控看不到失败率。
- URL 里动词 `POST /updateUser`，再解释一遍 REST 就站不住。
