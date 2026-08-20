# 常见 HTTP 状态码

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开（分类记，每类至少背 3 个高频的）

### 1xx 信息响应
- **100 Continue**：客户端 Expect: 100-continue，服务端说「你继续发 body」

### 2xx 成功
- **200 OK**：请求成功，返回数据
- **201 Created**：成功创建资源
- **204 No Content**：成功但没 body（DELETE 成功、PUT 更新成功常见）
- **206 Partial Content**：范围请求（Range）成功，断点续传 / 视频分片

### 3xx 重定向
- **301 Moved Permanently**：永久重定向（SEO 权重转移），浏览器会缓存
- **302 Found**：临时重定向（登录跳登录页、短链跳转）
- **304 Not Modified**：协商缓存命中（资源没变，用本地缓存）
- **307 Temporary Redirect**：和 302 一样但**请求方法和 body 不变**
- **308 Permanent Redirect**：301 的方法+body 不变版

### 4xx 客户端错误
- **400 Bad Request**：请求参数格式不对 / 缺参数
- **401 Unauthorized**：未认证（没登录 / token 过期 / token 错）
- **403 Forbidden**：已认证但没权限
- **404 Not Found**：资源不存在
- **405 Method Not Allowed**：接口不支持这个 HTTP Method
- **409 Conflict**：资源冲突（乐观锁冲突、用户名已存在）
- **413 Payload Too Large**：请求体太大
- **429 Too Many Requests**：限流了

### 5xx 服务端错误
- **500 Internal Server Error**：服务端挂了（空指针、DB 挂、panic）
- **502 Bad Gateway**：网关后面的上游服务挂了 / 没返回
- **503 Service Unavailable**：服务暂时不可用（停机维护、过载保护），配合 Retry-After
- **504 Gateway Timeout**：网关等上游超时

## 常见追问

- Q: 401 和 403 怎么区分？（401 是「你是谁」没搞清楚；403 是「知道你是谁，但你不能进来」）
  A:
- Q: 502 和 504 怎么区分？（502 = 上游挂了 / 连接被拒；504 = 上游连上了但太久没响应）
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
