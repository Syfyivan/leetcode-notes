# 错误处理与error包装

## 核心回答（面试口述版，1 分钟能讲完）

Go 的 error 是接口：`type error interface { Error() string }`。可预期的失败用返回值，不拿 panic 当控制流。`errors.New` / `fmt.Errorf` 造错误；`fmt.Errorf("open %s: %w", path, err)` 的 `%w` 把底层错误链起来。查链用 `errors.Is(err, os.ErrNotExist)`，按类型取出用 `errors.As(err, &target)`。panic 留给真正的程序 bug，比如索引越界，在边界用 recover 收。

## 展开

1. error 是接口，errors.New / fmt.Errorf

   `errors.New("msg")` 返回一个不可比内容、只比指针的 `*errorString`。`fmt.Errorf` 做格式化。哨兵错误是包级变量，`var ErrNotFound = errors.New("not found")`，调用方 `==` 或 `errors.Is`。自定义类型实现 `Error()` 可以带状态码、字段。

2. errors.Is / errors.As / %w 包装链

   `%w` 要求被包的值实现 `error`，生成的 wrapper 有 `Unwrap() error`。`errors.Is` 沿着 Unwrap 走，匹配 `==` 或 `Is(error) bool`。`errors.As` 找第一个能赋给目标类型的。自己写包装类型要提供 `Unwrap`，否则链断掉。不要用 `%v` 包错误还指望 Is 能挖出来。Go 1.20 起 `errors.Join` 可以并多个错误。

3. 和 panic 的边界（可预期错误 vs 程序 bug）

   文件不存在、用户输入非法、下游 500，都是 error，调用方必须看见。nil 指针、数组越界、不变式被破坏，才 panic。库代码尽量不 panic。`Must*` 只适合 `main` 启动期，配置都读不出来进程不该活。HTTP handler 里 recover 只挡 panic，把 500 吐给客户端，业务校验失败走 error。

## 延伸

- 相关题：接口与鸭子类型。error 的 typed nil 会让 `if err != nil` 永远为真。
- 对比：每层都 log 一次会刷屏。只在有足够上下文的边界打一条。
- 加码：`errors.Join` 合多个错误，Unwrap 变成切片，`Is` 仍能挖到其中任意一个。

## 代码 / 例子

```go
var ErrNotFound = errors.New("not found")

func load(path string) error {
    b, err := os.ReadFile(path)
    if err != nil {
        return fmt.Errorf("load %s: %w", path, err)
    }
    if len(b) == 0 {
        return ErrNotFound
    }
    return nil
}

if errors.Is(err, os.ErrNotExist) { /* 404 */ }
var pe *os.PathError
if errors.As(err, &pe) { log.Println(pe.Op, pe.Path) }
```

## 常见追问

- Q: Go 为什么不用 try-catch？这样设计的利弊？
  A: 设计者想让失败路径出现在函数签名里，调用方被迫写 `if err != nil`。好处是控制流直观，错误不会从三层之外飞进来。代价是样板多，容易出现 `return err` 把上下文丢光。所以才有 `%w` 包装。团队规范是：中间层包装上下文，边界处 `Is/As` 判断，日志打在有足够信息的那一层，不要每层都 log 一次。
- Q: 怎么给 error 附加堆栈信息？
  A: 标准库 error 不带栈。`fmt.Errorf("%w")` 只有消息链。需要栈用 `pkg/errors` 的 `errors.WithStack` / `Wrap`，或 `golang.org/x/xerrors`，或自己在错误类型里存 `runtime.Callers`。生产里一般只在错误诞生处记一次栈，避免每层 Wrap 都拍栈把日志撑爆。Go 1.21+ 的 `errors` 仍然不内置栈。

## 自己的易错点 / 之前答崩过的地方

- `if err != nil { return err }` 连包三层，顶层只看到 `EOF`，不知道哪个文件。
- 用 `err.Error() == "not found"` 字符串比较，一改文案全挂。用哨兵 + `Is`。
- `panic(err)` 当普通返回，defer recover 满天飞，等价于偷偷写了 try-catch 还丢了类型信息。
- 包装时 `%v` 和 `%w` 混用，`errors.Is` 挖不到 `os.ErrNotExist`。
