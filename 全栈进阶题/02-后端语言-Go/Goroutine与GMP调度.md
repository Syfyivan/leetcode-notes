# Goroutine与GMP调度

## 核心回答（面试口述版，1 分钟能讲完）

goroutine 是 Go runtime 调度的用户态协程，初始栈大约 2KB，不够再分段扩。线程是 OS 的 M，栈是 MB 级。调度模型叫 GMP：G 是 goroutine，M 是 OS 线程，P 是逻辑处理器，手里捏着本地运行队列。M 必须绑一个 P 才能跑 Go 代码。P 的个数由 `GOMAXPROCS` 决定，默认等于 CPU 核数。空闲的 P 会从别的 P 偷一半 G（work-stealing），sysmon 线程负责网络轮询和抢占。

## 展开

1. goroutine 和线程的区别（栈大小、切换成本）

   - 创建：`go f()` 只是分配一个 G 结构体和一块小栈，不走 `clone` 系统调用。线程创建是内核对象。
   - 栈：G 连续栈，溢出时 `runtime.morestack` 拷到更大块；线程栈预留 1~8MB。
   - 切换：G 切换只改三四个寄存器和 g 指针，在用户态完成。M 切换要进内核。
   - 阻塞：G 调同步 syscall 会让 M 陷入内核，P 会被抢走交给别的 M，剩下的 G 继续跑。网络 I/O 走 netpoll（epoll/kqueue/IOCP），G 挂起，M 不堵。

2. GMP 模型（G/M/P 各是什么，怎么协作）

   - **G**：goroutine。状态 `_Grunnable` / `_Grunning` / `_Gwaiting` / `_Gsyscall`。
   - **M**：machine，真实线程。M 的 `g0` 栈跑调度代码。
   - **P**：processor。本地队列约 256 个 G，还有 `mcache` 用来分配小对象。`GOMAXPROCS=N` 就是 N 个 P。

   跑 Go 代码必须 `M + P + G`。G 入队顺序：自己的 P 本地队列满了再丢全局队列。syscall 时 M 和 P 解绑；syscall 返回要重新抢 P，抢不到就把 G 放到全局队列。

3. work-stealing 和抢占式调度

   P 空了：先看全局队列 → netpoll 就绪的 G → 从别的 P 偷一半本地队列。偷是为了把多核吃满。
   抢占：Go 1.14 之前靠函数入口的 stack check，死循环不调函数就抢不下来。1.14 起 sysmon 发 `SIGURG` 做异步抢占，纯计算循环也能被拆时间片。GC 标记时也会抢占，让所有 P 进入安全点。

## 延伸

- 相关题：context 超时与取消。调度器再强也收不掉你忘了 return 的 G。泄漏几乎都堵在没人关的 channel 上。
- 对比：网络 I/O 走 netpoll，G 挂起 M 不堵；CGO 和同步 syscall 会占着 M，P 被抢走。
- 加码：pprof 看 `goroutine` 和 `mutex` 剖面。别只看 CPU。sysmon 的 `SIGURG` 能拆死循环，GC 标记仍要安全点。

## 代码 / 例子

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func main() {
    fmt.Println(runtime.GOMAXPROCS(0), runtime.NumCPU())
    for i := 0; i < 4; i++ {
        go func(id int) {
            for {
                // 1.14 之前这种死循环会占死一个 P；现在会被 SIGURG 抢占
                _ = id
            }
        }(i)
    }
    time.Sleep(time.Second)
}
```

## 常见追问

- Q: 开十万个 goroutine 为什么没问题，开十万个线程会崩？
  A: 十万个 G 大约是十万个 2KB 级栈加一点 g 结构体，内存几百 MB 量级，调度在用户态。栈会按需长，真占多少看每个 G 的调用深度。十万个线程是十万个内核栈、调度实体、页表，创建就要 `clone`，Linux 的 `pid_max`、`threads-max` 也会顶。真正危险的是 goroutine 泄漏：G 阻塞在没人关的 channel 上，十万会变成一千万。
- Q: P 的数量由什么决定（GOMAXPROCS）？
  A: 默认 `runtime.NumCPU()`，可用环境变量 `GOMAXPROCS` 或 `runtime.GOMAXPROCS(n)` 改。P 多于核会在 CPU 上打架；P 太少，多核吃不满。I/O 密集时 G 很多但 P 不必加很多，因为等 I/O 的 G 不占 P。改 GOMAXPROCS 不会立刻杀掉多余的 M，空闲 M 会休眠。

## 自己的易错点 / 之前答崩过的地方

- 把 P 说成「线程」。P 是调度器的上下文，M 才是线程。没有 P 的 M 只能卡在 syscall 或休眠。
- 以为 `time.Sleep` 会占着 P。Sleep 把 G 放到计时堆，P 去跑别人。
- 无缓冲 channel 互相等造成死锁，`all goroutines are asleep`。这是逻辑锁死，不是 GMP 坏了。
- 在高并发里用互斥锁保护热路径，M 阻塞在 `futex` 上，P 被拿走，看起来像「协程也能把线程堵死」。锁等待会让 G 挂起，runtime 会把 M 拿去跑别的；但 CGO / 阻塞 syscall 会真占 M。
