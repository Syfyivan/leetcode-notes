# Goroutine与GMP调度

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. goroutine 和线程的区别（栈大小、切换成本）
2. GMP 模型（G/M/P 各是什么，怎么协作）
3. work-stealing 和抢占式调度

## 代码 / 例子

```go
// TODO：写一段能说明问题的短代码，别贴大段源码
```

## 常见追问

- Q: 开十万个 goroutine 为什么没问题，开十万个线程会崩？
  A:
- Q: P 的数量由什么决定（GOMAXPROCS）？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
