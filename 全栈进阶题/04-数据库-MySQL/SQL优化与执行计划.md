# SQL优化与执行计划

## 核心回答（面试口述版，1 分钟能讲完）

慢 SQL 先 `EXPLAIN`，别猜。重点看 `type`、`key`、`rows`、`Extra`。`type` 从好到差大致是 `system/const > eq_ref > ref > range > index > ALL`。`key` 是实际用的索引，`rows` 是估计扫描行。`Extra` 里 `Using filesort`、`Using temporary` 要警惕，`Using index` 是覆盖索引。优化手段：让 WHERE / ORDER BY 走最左前缀、避免函数和隐式转换把索引废掉、深分页用 `WHERE id > last` 代替 `OFFSET` 很大。

## 展开

1. EXPLAIN 关键列（type/key/rows/Extra）

   - **id / select_type**：子查询、UNION 的编号。
   - **type**：访问方法。`const` 主键或唯一键等值；`eq_ref` 连接时主键 / 唯一键；`ref` 普通二级索引等值；`range` 范围；`index` 扫整棵索引树；`ALL` 扫全表。
   - **possible_keys / key**：候选和实际。`key` 为 NULL 就是没走索引。
   - **key_len**：用了索引多少字节，联合索引有没有用到后面几列看它。
   - **rows / filtered**：估计行数和 WHERE 过滤比例。
   - **Extra**：`Using where` 回表后过滤；`Using index` 覆盖；`Using index condition` ICP；`Using filesort` 内存或磁盘排序；`Using temporary` 隐式临时表。

   MySQL 8.0 用 `EXPLAIN ANALYZE` 看真实耗时和实际 rows。

2. 索引失效的常见场景

   - 对索引列套函数：`WHERE DATE(created_at)= '2024-01-01'`
   - 隐式类型转换：`phone` 是 VARCHAR，`WHERE phone = 138...` 把列转成数字
   - 前导模糊：`LIKE '%abc'`
   - 最左前缀断开：`(a,b)` 上 `WHERE b=1`
   - `OR` 一侧没索引
   - 不等于、`IS NOT NULL` 有时优化器改走全表（看选择率）
   - `ORDER BY` 和 WHERE 用了两套不同索引，容易 filesort

3. 深分页优化

   `LIMIT 1000000, 20` 要丢掉前 100 万行，即使有索引也得回表或扫过。改成：
   - 记住上一页最大 id：`WHERE id > ? ORDER BY id LIMIT 20`
   - 延迟关联：先在覆盖索引里取出 20 个主键，再 JOIN 回表拿整行
   - 业务上禁止跳到十万页，给搜索用 ES

## 延伸

- 相关题：索引原理与 B+ 树。覆盖索引会让 Extra 出现 `Using index`，`SELECT *` 很容易毁掉它。
- 对比：ICP（`Using index condition`）是在索引上先过滤再回表，和覆盖索引不是一回事。
- 加码：联合索引列顺序按等值、范围、排序来排。range 列后面的基本用不上。

## 代码 / 例子

```sql
EXPLAIN SELECT * FROM t WHERE uid = 42 AND status = 1;
-- 期望 type=ref, key=idx_uid_status, Extra 尽量 Using index（若只选索引列）

-- 深分页
SELECT t.* FROM t
JOIN (SELECT id FROM t WHERE uid=42 ORDER BY id LIMIT 100000, 20) x
  ON t.id = x.id;

-- 更好：seek
SELECT * FROM t WHERE uid=42 AND id > 123456 ORDER BY id LIMIT 20;
```

## 常见追问

- Q: type 里 index 和 range 谁更好？
  A: **range 更好**。range 是索引树上走一段；index 是全索引扫描，叶子从头到尾，只是不回表（或少读数据页）。`type=index` 常常出现在 `ORDER BY` 走了索引但没 WHERE，或覆盖索引全扫。`ALL` 比 `index` 更差，因为扫的是聚簇索引整行。
- Q: like '%x' 为什么用不上索引？
  A: B+ 树按列值从左排序，`%x` 不知道前缀，无法二分定位叶子。`x%` 有固定前缀，可以 range。要把后缀搜索做好，用倒排（ES）或把列反转再存一份。`LIKE '?'` 等值时优化器当 ref。

## 自己的易错点 / 之前答崩过的地方

- 看到 `possible_keys` 有值就说走了索引。看 `key`。
- `rows=1` 不一定真快，那是估计。`EXPLAIN ANALYZE` 才能看实际。
- `SELECT *` 把覆盖索引打成回表，Extra 从 `Using index` 变成 `Using where`。
- 在索引列上写 `WHERE a + 1 = 2`，和函数套列同一类失效。
