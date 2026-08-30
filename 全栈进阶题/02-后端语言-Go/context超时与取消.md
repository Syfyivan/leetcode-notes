# context超时与取消

## 核心回答（面试口述版，1 分钟能讲完）

`context.Context` 在请求链上传递截止时间和取消信号。根是 `context.Background()`（或测试里 `TODO()`），往下派生 `WithCancel` / `WithTimeout` / `WithDeadline` / `WithValue`。父取消，子全部取消，`ctx.Done()` 这个 channel 被 close，`ctx.Err()` 是 `Canceled` 或 `DeadlineExceeded`。HTTP 服务里每个请求一个 ctx，打下游 RPC、查库、读 Redis 都把同一个 ctx 传下去，客户端断开或超时就能把整棵 goroutine 树收掉。

## 展开

1. WithCancel/WithTimeout/WithDeadline/WithValue

   - `WithCancel`：返回 `ctx, cancel`。调 `cancel()` 关闭 Done。必须在结束时调，通常 `defer cancel()`，否则 timer 和子节点泄漏。
   - `WithTimeout(parent, d)`：内部是 Deadline = now+d 的 cancelCtx + timer。
   - `WithDeadline(parent, t)`：绝对时间。父的 deadline 更早则沿用父的。
   - `WithValue`：存 request-scoped 的键值，key 要用未导出类型，避免碰撞。只放追踪 ID、logger，不放可选参数。

   ctx 不可变，每次派生都是新节点挂到树上。

2. context 树的传播与取消广播

   取消是向下广播：父的 `children` map 里每个子 `cancel(true)`。Done 被 close 后，所有 `select { case <-ctx.Done() }` 被唤醒。取消不会「杀掉」goroutine，只是发信号，goroutine 必须自己 return。这就是泄漏的根源：起了 G 却不听 Done。

3. 在 HTTP 请求链路里怎么传 context

   `http.Request` 自带 `r.Context()`，客户端断开时 net/http 会 cancel。handler 里 `ctx := r.Context()`，`db.QueryContext(ctx, ...)`、`http.NewRequestWithContext(ctx, ...)`。下游超时用 `context.WithTimeout(ctx, 200*time.Millisecond)` 再派生一截，函数返回时 `defer cancel()` 清 timer。gRPC 的 ctx 从 metadata 里来，同一套习惯。

## 延伸

- 相关题：Channel 与 select。取消信号就是被 close 的 `Done` channel。
- 对比：`r.Context()` 在客户端断开时取消；`WithTimeout` 是截止时间。派生了一截却把父 ctx 传给下游，超时根本没生效。
- 加码：`go worker()` 不听 `Done`，外层已经 504 了 worker 还堵在 RPC 上。pprof 的 goroutine 能看见成片的 `chan receive`。

## 代码 / 例子

```go
func handle(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 300*time.Millisecond)
    defer cancel()

    resCh := make(chan string, 1)
    go func() {
        v, err := rpc(ctx) // rpc 内部 select ctx.Done()
        if err != nil {
            return
        }
        resCh <- v
    }()

    select {
    case v := <-resCh:
        w.Write([]byte(v))
    case <-ctx.Done():
        http.Error(w, ctx.Err().Error(), 504)
    }
}
```

## 常见追问

- Q: 为什么不建议用 context 传业务参数？
  A: `Value` 没有类型约束，key 碰撞靠约定，调用方看函数签名不知道还缺什么。参数应该出现在函数参数列表里，编译器能查。ctx 留给截止、取消、trace id。Go 官方文档原话：use context values only for request-scoped data that transits processes and APIs。
- Q: goroutine 泄漏和 context 有什么关系？
  A: 典型写法是 `go worker()` 里阻塞在 `ch` 或 RPC 上，外层已经超时返回了，worker 还活着。修复是把 ctx 传进去，`select { case <-ctx.Done(): return; case v := <-ch }`。泄漏在 pprof 的 `goroutine` 里能看到成片的 `chan receive` / `select`。忘了 `defer cancel()` 会让 timerCtx 的 timer 一直占着，也是一种泄漏。

## 自己的易错点 / 之前答崩过的地方

- `WithTimeout` 的 `cancel` 不 defer，短请求堆积大量 timer。
- 用 `context.Background()` 去打下游，用户已经断开还在查库。
- 在循环里 `go func() { ... }()` 闭包捕获了会变的 `ctx` 或 `i`，取消对不上号。
- 把 struct 指针塞进 `WithValue` 当 DI 容器，测试和静态分析都变难。
