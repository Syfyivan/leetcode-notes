# 持久化RDB与AOF

## 核心回答（面试口述版，1 分钟能讲完）

RDB 是某个时间点的二进制快照，`BGSAVE` 时 `fork` 子进程，利用 OS 的 copy-on-write 把全量写到 dump 文件。AOF 是写命令追加日志，更细，文件更大。AOF 会定期重写压成最短命令序列。4.0 起混合持久化：AOF 文件头是一段 RDB，后面接增量 AOF。恢复时优先用 AOF（若开启），因为通常更新；纯 RDB 丢的是上次快照之后的数据。

## 展开

1. RDB 快照 vs AOF 追加日志

   RDB：`SAVE` 阻塞主线程；`BGSAVE` fork。配置 `save 60 10000` 表示 60 秒内 1 万次写就快照。恢复快，适合备份、主从全量同步。fork 瞬间内存可能翻倍压力，大实例会抖。
   AOF：每条写命令（或多个写攒成）append。`appendfsync always / everysec / no`。always 最安全每条 fsync，慢；everysec 最多丢 1 秒；no 交给 OS。AOF 比 RDB 完整，重放慢。

2. AOF 重写、混合持久化

   文件膨胀后 `BGREWRITEAOF`：子进程根据当前内存生成一份最短 AOF（直接 SET 最终值，而不是 INCR 一万次）。重写期间的新写记在缓冲，结束后拼上去。
   `aof-use-rdb-preamble yes`：重写产物前面是 RDB 快照，后面才是增量命令，恢复先载入快照再重放尾巴，速度快很多。

3. 两者的恢复速度与数据安全权衡

   | | 安全 | 恢复速度 | 体积 | 运行时成本 |
   | --- | --- | --- | --- | --- |
   | RDB | 丢上次快照后的数据 | 快 | 小 | fork 抖 |
   | AOF everysec | 最多丢约 1 秒 | 慢（混合后可接受） | 大 | 追加 + 重写 |
   | 混合 | 接近 AOF | 接近 RDB | 中 | 两边都有 |

   缓存实例可以只开 RDB 甚至关闭持久化；当主存储必须 AOF everysec + 混合。

## 延伸

- 相关题：主从复制。PSYNC 不够时全量同步就是一份 RDB。
- 对比：`SAVE` 堵主线程，`BGSAVE` 才是生产用法。fork 抖一看 `latest_fork_usec`。
- 加码：rewrite 期间新写进缓冲，结束后拼回去。重写是根据内存生成最短命令，不是把旧日志删掉。

## 代码 / 例子

```text
CONFIG SET save "900 1 300 10"
CONFIG SET appendonly yes
CONFIG SET appendfsync everysec
CONFIG SET aof-use-rdb-preamble yes
BGSAVE
BGREWRITEAOF
INFO persistence
```

## 常见追问

- Q: 宕机后用 RDB 还是 AOF 恢复？
  A: 同时开时 Redis 启动走 AOF，因为更新。AOF 损坏可用 `redis-check-aof --fix`。只有 RDB 就加载 `dump.rdb`，数据回到最后一次成功 BGSAVE。主从全量同步用的也是 RDB 快照（PSYNC 不够时）。
- Q: appendfsync 三种策略的取舍？
  A: `always`：每条写都 fsync，延迟高，SSD 也吃力，几乎没人用。`everysec`：后台线程每秒 fsync，日常默认，崩了最多丢 1 秒。`no`：等 OS 刷，崩了丢多少看 `vm.dirty`。金融账本类别把 Redis 当唯一真相源；要当真相源至少 everysec + 主从。

## 自己的易错点 / 之前答崩过的地方

- 以为 AOF always 等于绝对不丢。磁盘本身损坏、写到一半断电，仍可能要 --fix。
- fork 导致的延迟当成「Redis 变慢无原因」。看 `latest_fork_usec`。
- 从库也开 AOF everysec，磁盘打满，复制中断。从库持久化策略要单独想。
