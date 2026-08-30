# Promise.all / race / allSettled / any 的区别

## 核心回答（面试口述版，1 分钟能讲完）

四个都是「一组 Promise 一起等」，差在成功/失败怎么收口。
`all`：全部成功才成功，返回值按输入顺序排；有一个失败立刻 reject。
`race`：谁先敲定听谁的，成功失败都算。
`allSettled`：等全部结束，永远 fulfilled，每项是 `{status, value}` 或 `{status, reason}`。
`any`：谁先成功听谁的；全失败才 reject，reason 是 `AggregateError`。
空数组：`all` / `allSettled` 立刻成功给 `[]`；`any` 立刻失败；`race` 会永远 pending。
并发请求要全部成功用 all，允许部分失败用 allSettled，超时赛跑用 race。

## 展开

对比四个方法在以下维度的行为（画一张表也行）：

| 维度 | all | race | allSettled | any |
| --- | --- | --- | --- | --- |
| 全部成功时返回？ | 按输入顺序的结果数组 | 第一个敲定的那个值 | `[{status:'fulfilled', value}, ...]` | 第一个成功的值 |
| 任意一个失败时？ | 立刻 reject，其余请求停不下来 | 若它是第一个敲定的，就 reject | 记成 `{status:'rejected', reason}`，继续等 | 忽略，等下一个成功 |
| 返回值格式 | `T[]` | `T` | `{status, value\|reason}[]` | `T` |
| 空数组参数行为 | 立刻 `[]` | 永远 pending | 立刻 `[]` | 立刻 `AggregateError` |
| 应用场景举例 | 多个请求都要成功再渲染 | 超时：`race([请求, sleep])` | 多个接口，失败也要展示 | 多个源，命中一个就行 |

补充：输入里的非 Promise 会先 `Promise.resolve` 包一层。`all` 失败是 fail-fast，已经发出去的请求不会取消。

## 延伸

- 相关题：手写 `Promise.all` / `race` / `allSettled`。
- 对比题：超时用 race（timeout 是 reject）；多源择优用 any。空数组 `race` 会永远 pending。
- 面试加码：`all` fail-fast 取消不了已经发出的请求，要自己 AbortController。结果数组按下标排，不按完成时间。

## 代码 / 例子

```js
const ok = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));
const fail = (e, ms) => new Promise((_, r) => setTimeout(() => r(e), ms));

Promise.all([ok(1, 30), ok(2, 10)]).then(console.log);          // [1, 2] 按入参顺序
Promise.all([ok(1, 30), fail('e', 10)]).catch(console.log);     // 'e'

Promise.race([ok(1, 30), fail('e', 10)]).catch(console.log);    // 'e' 谁快听谁
Promise.any([fail('e', 10), ok(1, 30)]).then(console.log);      // 1 跳过失败

Promise.allSettled([ok(1, 10), fail('e', 10)]).then(console.log);
// [{status:'fulfilled', value:1}, {status:'rejected', reason:'e'}]
```

## 常见追问

- Q: `Promise.race` 和 `Promise.any` 什么时候行为不同？
  A: 第一个敲定是 reject 时就不一样。race 直接失败；any 当没看见，继续等后面的 fulfill。一组里「失败来得快、成功来得慢」，race 会失败，any 会成功。全失败时 any 给出 `AggregateError`（`.errors` 是数组），race 只给出第一个 reason。空数组更明显：race 挂起，any 立刻失败。

## 自己的易错点 / 之前答崩过的地方

我以前说 `all` 的结果按完成时间排序。它按**入参数组下标**排，跟谁先完成无关。
`race` 和 `any` 我混过，超时场景如果 timeout 是 reject，用 any 会把超时忽略掉，该用 race。
空数组 `Promise.race([])` 我以为立刻 undefined。它会永远 pending，页面就一直转圈。
