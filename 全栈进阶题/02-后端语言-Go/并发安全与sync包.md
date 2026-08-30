# 并发安全与sync包

## 核心回答（面试口述版，1 分钟能讲完）

共享内存就要同步。`sync.Mutex` 互斥；读多写少用 `RWMutex`。一组 goroutine 收尾用 `WaitGroup`，`Add` 在起 G 之前调。`Once` 做单次初始化。`atomic` 适合计数器、标志位，比锁轻，但组合操作不能拆成两次 atomic 当事务。channel 传递所有权，Mutex 保护一块内存，别混着用把同一份数据保护两套。`sync.Map` 针对「键几乎不相交、写少读多」，一般场景 `map + Mutex` 更快。

## 展开

1. Mutex/RWMutex 的使用场景

   `Lock/Unlock` 保护临界区。`Unlock` 必须 `defer`，panic 路径也要放。别拷贝已使用的 Mutex，struct 传值会拷锁。
   `RWMutex`：`RLock` 可并行，`Lock` 独占。写锁优先（避免写者饿死）。临界区很短、写也不少时，RW 的开销可能比 Mutex 差，先测。
   锁粒度：太大吞吐差，太细容易死锁。按数据结构一把锁通常够校招题。

2. sync.WaitGroup、sync.Once、sync.Pool

   - WaitGroup：`Add(n)` 不能负数；`Done` 等于 `Add(-1)`。先 Add 再 `go`，否则 Wait 可能提前返回。别把 WG 拷进 goroutine，传指针。
   - Once：`Do(f)` 保证 f 只跑一次，并发调用会等第一次结束。panic 过的 Once 不会再跑。
   - Pool：`Get/Put` 复用 `[]byte`、临时结构体，降低 GC。Pool 在 GC 时会清掉缓存，不适合当连接池。Put 前要把对象重置，避免脏数据串请求。

3. atomic 原子操作 vs 锁

   `atomic.AddInt64`、`CompareAndSwap`、`Load/StorePointer` 在硬件上一条指令或 CAS 循环。单变量计数、关停标志用它。涉及两个变量的不变式，还是 Mutex。`atomic.Value` 可以无锁读配置快照。Go 1.19 的 `atomic.Int64` 封装更不容易用错对齐。

## 延伸

- 相关题：Goroutine 与 GMP。锁等待会把 G 挂起；CGO / 阻塞 syscall 才真占 M。
- 对比：`sync.Pool` 给 GC 减负，不能当连接池。GC 时会丢掉缓存对象。
- 加码：`go test -race` 是底线。锁从「一把包住结构体」开始，别一上来分段锁。

## 代码 / 例子

```go
var mu sync.Mutex
var n int
var once sync.Once
var wg sync.WaitGroup

func inc() {
    mu.Lock()
    n++
    mu.Unlock()
}

func main() {
    once.Do(func() { /* init */ })
    wg.Add(10)
    for i := 0; i < 10; i++ {
        go func() { defer wg.Done(); inc() }()
    }
    wg.Wait()
}
```

## 常见追问

- Q: 什么时候用 channel，什么时候用 Mutex？
  A: 数据要换主人、做流水线、通知完成，用 channel。一块结构被多方就地改，用 Mutex。Go 谚语：不要通过共享内存通信，通过通信共享内存。但计数器、缓存 map 硬套 channel 会更绕。面试可以说：所有权转移走 channel，就地保护走锁。
- Q: sync.Map 和普通 map+锁 的取舍？
  A: `sync.Map` 内部两张 map（read 只读快照 + dirty），适合 key 稳定、读远多于写，或多 goroutine 操作不同 key。单锁 + 普通 map 在中小规模、写不少时往往更快，代码也好调试。别因为「听起来并发安全」就全换 sync.Map。先 `go test -race` 保证正确，再 benchmark。

## 自己的易错点 / 之前答崩过的地方

- `go f(&wg)` 写成 `go f(wg)`，拷贝 WG，Wait 永远等不到。
- 循环里 `wg.Add(1); go ...` 漏 Done，Wait 卡死。panic 路径要用 `defer wg.Done()`。
- 读锁套写锁：`RLock` 期间同一 goroutine `Lock` 会死锁，RWMutex 不可重入。
- 对 struct 字段一部分用 atomic 一部分用 Mutex，没有 happens-before，race detector 会叫。
