# 事务与ACID

## 核心回答（面试口述版，1 分钟能讲完）

事务把一组 SQL 当成要么全成要么全不成的单元。ACID：原子性靠 undo log 回滚；持久性靠 redo log 先落盘（WAL）；隔离性靠锁 + MVCC；一致性是目标，靠前三者加上约束（主键、外键、check）和业务不变式。InnoDB 崩溃恢复：用 redo 把已经刷到 redo、还没刷数据页的改动补齐，再用 undo 把未提交事务撤回。binlog 是 server 层日志，给复制和备份用，和 redo 靠内部两阶段提交对齐。

## 展开

1. 原子性/一致性/隔离性/持久性各靠什么保证

   - **A**：事务失败或 `ROLLBACK`，按 undo log 反向操作。undo 是逻辑日志，记「把某行改回旧值」。
   - **C**：数据库保证约束不被打破；跨行业务一致要靠事务边界划对。隔离失败也会破坏一致，所以 C 依赖 A/I/D。
   - **I**：见隔离级别专题。快照读走 MVCC，当前读走行锁 / 间隙锁。
   - **D**：提交前 redo 写到 `ib_logfile`（`innodb_flush_log_at_trx_commit=1` 时 `fsync`）。数据页可以稍后由刷脏线程写回。

2. redo log（持久性）、undo log（原子性）

   redo 是物理日志：某个页偏移改了哪些字节。循环写两个（或更多）redo 文件，checkpoint 推进后旧段可覆盖。undo 存在 undo tablespace，既给回滚，也给 MVCC 当历史版本链（`DB_ROLL_PTR`）。一个更新：先写 undo（旧值）→ 改数据页 → 写 redo（含 undo 的修改）。提交只保证 redo 落盘，不保证数据页落盘。

3. 一致性是目的，其余三个是手段

   转账 A-100、B+100，原子性保证不会只扣一边；隔离性保证别人看不到中间态；持久性保证提交后断电还在。没有这三项，一致无从谈起。但三项都在，业务如果少更新一行，一致照样坏。面试别把 C 说成「有一份独立日志」。

## 代码 / 例子

```sql
START TRANSACTION;
UPDATE account SET bal = bal - 100 WHERE id = 1 AND bal >= 100;
UPDATE account SET bal = bal + 100 WHERE id = 2;
COMMIT;
-- 任一句失败 ROLLBACK，undo 把两行拉回旧值
-- 提交成功后即使 mysqld 被 kill，redo 恢复后余额仍对
```

## 常见追问

- Q: MySQL 崩溃恢复靠什么？
  A: 重启时 InnoDB 扫 redo，从 checkpoint 重放到崩溃点，把脏页补全（redo）。然后看事务状态：未提交的用 undo 回滚。已提交但数据页没刷的，靠 redo 已经补上了，不必再走业务 SQL。`innodb_flush_log_at_trx_commit=2` 时可能丢最后一秒提交，这是性能换持久。
- Q: binlog 和 redo log 的区别与两阶段提交？
  A: redo 是 InnoDB 物理日志，管崩溃恢复；binlog 是 server 层逻辑日志（ROW/STATEMENT），管主从和按时间点恢复。一次提交要两份日志都有。内部 XA：prepare（redo 写 prepare）→ 写 binlog 并 fsync → commit（redo 写 commit）。崩在 prepare 之后、binlog 之前：恢复时回滚。崩在 binlog 之后、InnoDB commit 之前：恢复时根据 binlog 提交，避免主从数据对不上。

## 自己的易错点 / 之前答崩过的地方

- 把 redo 和 binlog 说成同一个东西。一个物理一个逻辑，一个引擎层一个 server 层。
- 以为 `COMMIT` 返回就表示数据页在磁盘上。只表示 redo（以及策略要求的 binlog）在磁盘上。
- `innodb_flush_log_at_trx_commit=0/2` 和 `sync_binlog=0` 一起开，崩溃会丢事务，双一才是 `1` + `1`。
