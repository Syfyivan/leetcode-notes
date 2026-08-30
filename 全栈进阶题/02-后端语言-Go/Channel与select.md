# Channel与select

## 核心回答（面试口述版，1 分钟能讲完）

channel 是带类型的消息管道，也是同步原语。无缓冲 channel 发送和接收必须碰面，否则阻塞。有缓冲的在缓冲满时发送阻塞、空时接收阻塞。`close` 之后还能把剩余值读完，再读到零值和 `ok=false`；往已关闭的 channel 写会 panic。`select` 同时等多个 case，多个就绪时均匀随机挑一个；带 `default` 就是非阻塞探测。超时常用 `select` 加 `time.After` 或 `ctx.Done()`。

## 展开

1. 有缓冲 vs 无缓冲 channel

   `make(chan T)` 无缓冲，handshake：sender 的 G 和 receiver 的 G 直接交接。
   `make(chan T, n)` 有环形队列，长度 n。发送时拷进缓冲就返回，不必对方已经在收。
   nil channel 上发送或接收会永远阻塞，`select` 里用来禁用某个 case。
   容量选多少：0 表示同步；1 常当信号量；大缓冲要说清上限，否则等于无界内存。

2. close channel 的行为、从已关闭 channel 读会怎样

   关闭是广播：所有阻塞的接收者被唤醒，读到已缓冲的值，然后是零值 + `ok=false`。
   约定：**写者关闭，读者不关**。多个写者不能各自 close，要另用 `sync.Once` 或让协调者关。
   读关闭 channel 不会 panic，所以 range 能自然结束：`for v := range ch`。
   重复 close、close nil channel 都会 panic。

3. select 多路复用、default 非阻塞

   `select` 的 case 必须是发送或接收。编译器会把就绪的 case 做成列表，运行时 `fastrand` 挑一个，避免固定偏向第一个 case。全阻塞又没有 default 就挂起当前 G。有 default 立刻走 default。
   `time.After` 每次 select 都创建一个 timer，循环里要用 `time.NewTimer` 并 `Stop`/`Reset`，否则泄漏 timer。

## 代码 / 例子

```go
ch := make(chan int, 1)
ch <- 1
select {
case ch <- 2:
    // 缓冲已满，这支不会走
default:
    fmt.Println("full")
}

func fetch(ctx context.Context, ch chan string) {
    select {
    case <-ctx.Done():
        return
    case ch <- "ok":
    }
}
```

## 常见追问

- Q: 向已关闭的 channel 写会发生什么？
  A: panic：`send on closed channel`。读不会。所以关闭权留给发送方。多个发送方时用 `sync.WaitGroup` 等他们结束，再由一个地方 close。用 `recover` 去挡这个 panic 是歪路，先把生命周期设计对。
- Q: 用 channel 实现一个超时控制？
  A: `select { case v := <-ch: ...; case <-time.After(time.Second): ... }`。请求链上更该传 `context.WithTimeout`，在 `ctx.Done()` 和业务 channel 之间 select，取消能顺着树往下传。注意 `time.After` 在 tight loop 里会堆积 timer。

## 自己的易错点 / 之前答崩过的地方

- 无缓冲 channel 只发不收，死锁。测试里 `ch <- 1` 写在没有 goroutine 收的地方。
- 已关闭还写，生产里偶发 panic，根因是两个地方都能 close。
- `len(ch)` 当「还有没有人要发」用。它只是当前缓冲长度的瞬时值，无缓冲永远是 0。
- `select` 里两个 case 都就绪时以为一定走上面那个。runtime 是随机的。
