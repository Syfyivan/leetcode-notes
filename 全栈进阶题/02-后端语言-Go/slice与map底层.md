# slice与map底层

## 核心回答（面试口述版，1 分钟能讲完）

slice 是三个字的结构体：指针、len、cap，指向一块连续数组。`append` 时 cap 不够就扩容：256 以下大致 2 倍，再往上大约 1.25 倍，然后拷旧数据。函数传 slice 只拷这三个字，底层数组共享，改元素外面看得见，append 一旦换了数组就分家。map 是哈希表 `hmap`，每个桶 8 个键值，装载因子 6.5 触发增量扩容。遍历起点是随机的，不能依赖顺序。

## 展开

1. slice 的三要素（ptr/len/cap）与扩容机制

   `type slice struct { array unsafe.Pointer; len, cap int }`。`s[i]` 是 `array` 起第 i 个。`s[a:b]` 新 header 指向同一数组，len=b-a，cap 到原 cap 末尾（三下标 `s[a:b:c]` 可收紧 cap）。
   `growslice`：新 cap 至少装下本次 append。Go 1.18 之后算法是小切片翻倍，超过 256 按 `old + (old+3*256)/4` 涨。内存对齐到 sizeclass。扩容一定拷贝，旧数组若没人引用就等 GC。

2. map 的哈希桶结构、扩容

   `hmap` 持有 `B`（桶数 2^B）、`count`、`buckets`。每个 `bmap` 8 个 tophash + 8 key + 8 value，溢出链到 `overflow`。哈希用运行时随机 seed，抗哈希碰撞。
   装载因子 `count / (8*2^B) > 6.5` 就翻倍扩容。扩容是增量的：每次写操作搬 1~2 个旧桶到新桶（evacuate），所以扩容期间有 oldbuckets。key 不可取址，因为搬桶会挪位置。`map[K]V` 的 V 若是 struct，不能直接改字段，要整体赋回去。

3. slice 作为参数传递的坑（共享底层数组）

   传参拷 header。`func f(s []int) { s[0] = 1 }` 调用方看得到。`s = append(s, x)` 若没扩容，改的是同一数组且调用方 len 不变（header 是拷贝的）；若扩容，调用方仍指向旧数组。要让外部长度变，返回新 slice 或传 `*[]T`。`append` 到共享数组可能踩到别的切片的 cap 区间，这是子切片 bug 的来源，切的时候用 `s[a:b:b]` 锁 cap。

## 延伸

- 相关题：并发安全。map 一写多读直接 fatal，不是数据错一点。
- 对比：传 slice 拷三个字；传 map 拷的是 hmap 指针，函数里插键外面看得见。
- 加码：map 元素不能取址，改字段要整份写回。扩容会搬家，这就是原因。

## 代码 / 例子

```go
a := []int{1, 2, 3}
b := a[:2]          // ptr 相同，len=2, cap=3
b = append(b, 9)    // 没扩容，a 变成 [1 2 9]
c := append(a, 4)   // cap 不够，新数组，a 不变

m := map[string]int{"a": 1}
for k, v := range m {
    _ = k
    _ = v // 每次起点不同
}
```

## 常见追问

- Q: append 之后原 slice 会不会被影响？
  A: 看有没有换数组。`len < cap` 时原地写，原 slice 对应位置会被改掉，但原 len 不变。`len == cap` 时分配新数组并拷贝，原 slice 不受影响。子切片 `a[:1]` 往往还握着原 cap，append 很容易误改 `a`。
- Q: map 遍历为什么是无序的？
  A: runtime 在 `mapiterinit` 里随机挑起始桶和偏移，防止有人把 map 当有序容器，也降低哈希碰撞攻击的可预测性。需要稳定顺序就先把 key 抽到 slice 再 `sort`。Go spec 写明 iteration order is not specified。

## 自己的易错点 / 之前答崩过的地方

- `var s []int` 是 nil slice，`len==0`，`append` 可用；`s == nil` 为 true。`s := []int{}` 非 nil。JSON 里 nil 编成 `null`，空切片编成 `[]`。
- 并发读写 map 直接 fatal：`concurrent map writes`。要 `sync.Mutex` 或 `sync.Map`。
- `for i, v := range s` 的 `v` 是拷贝。取址 `&v` 拿到的是同一个循环变量地址（1.22 之前），切片里会全是最后一项。
- 把大数组切片长期挂在小 header 上，整块数组退不给 GC。该 `copy` 到新切片。
