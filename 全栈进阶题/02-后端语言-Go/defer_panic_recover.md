# defer / panic / recover

## 核心回答（面试口述版，1 分钟能讲完）

`defer` 在函数返回前按 LIFO 执行，用来关资源：`defer f.Close()`。参数在碰到 defer 语句时就求值，真正调用等到函数退出。`panic` 沿调用栈往上走，沿路把已注册的 defer 跑完；某层 defer 里 `recover()` 能把 panic 值拿回来，函数随后正常返回。`recover` 只在 defer 里有效，直接调用拿到的是 nil。for 循环里 defer 会积到函数结束才跑，文件打开上万次会把内存和 fd 顶满。

## 展开

1. defer 的执行时机与 LIFO 顺序

   函数走到 `return` 或 panic 时，runtime 把 `_defer` 链表从头跑到尾，后注册的先跑。`return a, f()` 会先算返回值，再跑 defer，再真正 RET。多个 defer 关锁时要注意顺序：先 Lock 后 `defer Unlock`，嵌套锁按反序释放。defer 调用有开销，热循环里别用它做普通逻辑。

2. defer 里读取返回值（命名返回值）

   匿名返回值：defer 闭包读到的是当时的局部变量，改不了已经算好的返回值。
   命名返回值：`func f() (n int)` 里 `defer func() { n++ }()` 能改返回值，因为 n 是栈上有名变量，return 写完 n 之后 defer 还能再改。`defer f(n)` 这种带参数的，n 在 defer 注册时就拷了，后面改 n 不影响。

3. recover 只能在 defer 里生效

   panic 把当前 G 的 `panic` 链表挂上，跑 defer。defer 里调 `recover()` 清掉 panic，返回 panic 的值。普通函数里调 recover 恒为 nil。recover 之后当前函数返回其返回值（零值或命名返回值），调用方看不出发生过 panic。HTTP 中间件常用 `defer func() { if r := recover(); r != nil { ... } }()` 挡 handler 崩溃。

## 延伸

- 相关题：错误处理与 error 包装。可预期失败走 error，panic 留给 bug，HTTP 入口才 recover。
- 对比：`os.Exit` 不跑 defer；panic 会跑。进程要关文件、关锁，别走 Exit。
- 加码：recover 之后把 500 和堆栈打进日志，别把 panic 值直接回给客户端。`defer recover()` 这种写法无效。

## 代码 / 例子

```go
func f() (n int) {
    defer func() {
        if r := recover(); r != nil {
            n = -1
        }
    }()
    defer func() { n++ }() // 命名返回值，能改 n
    n = 1
    panic("boom")
    return // 实际返回 -1：先 n++ 成 2，再被 recover 改成 -1（顺序看 defer LIFO）
}

func leak() {
    for i := 0; i < 10000; i++ {
        f, _ := os.Open("x")
        defer f.Close() // 循环结束才关，fd 爆
    }
}
```

## 常见追问

- Q: for 循环里 defer 有什么坑？
  A: defer 绑的是函数，不是循环体。一万次 `defer f.Close()` 要等整个函数返回才关，fd 和内存一起涨。循环里该立即 Close，或包一层匿名函数 / 单独函数让 defer 在每轮结束触发。1.22 之前循环变量 i 被 defer 闭包捕获也会全是最后一轮的值。
- Q: panic 之后 defer 还会执行吗？
  A: 会。从 panic 点往调用栈上走，每一层已经注册的 defer 都会跑。这才能关锁、关文件。某层 recover 成功，更上面的函数当正常返回。没有人 recover，进程打印栈然后退出，`os.Exit` 除外：`os.Exit` 不跑 defer。

## 自己的易错点 / 之前答崩过的地方

- `defer recover()` 写成这样无效：recover 的调用者必须是 defer 的函数本身。要 `defer func() { recover() }()`。
- 以为 `defer f.Close()` 能检查 Close 的 error。应该 `defer func() { _ = f.Close() }()`，需要处理错误时在 defer 里赋值给命名返回的 err。
- 在插件或库的导出函数里乱 recover，把调用方的 panic 吞掉，死锁更难查。
- 上面例子里 LIFO：后注册的 recover 先跑还是后跑要在脑子里走一遍，面试现场容易把返回值说反。
