# nextTick 原理

## 核心回答（面试口述版，1 分钟能讲完）

Vue 改数据不会立刻改 DOM。同一轮事件循环里多次改，会排进一个队列，只开一次 watcher 刷新。
所以你改完马上读 `$el` 或 `ref`，拿到的还是旧 DOM。
`nextTick(fn)` 把 fn 放到这次 DOM 更新之后。Vue3 用 `Promise.then`，也就是微任务。
时机：本轮数据 flush 完 → 微任务里的 nextTick 回调 → 浏览器再绘制。
`await nextTick()` 多数情况能读到新 DOM。若回调里又改数据，会再排一轮更新，可能还要再等一次。
别用 `setTimeout` 代替，那是宏任务，比 nextTick 晚，还可能夹一次绘制。

## 展开

1. 为什么需要 nextTick？（Vue 的 DOM 更新是「异步批量」的，同一 Tick 的修改合并一次渲染）

watcher 跑在队列里，默认 `flush: 'pre'` 的组件更新在微任务里统一 `flushJobs`。同一组件多次 `count++` 只渲染一次。同步代码读 DOM 必然是更新前的快照。

2. nextTick 回调的执行时机？（本轮微任务末尾，DOM 更新后、浏览器绘制前）

Vue 把更新 job 和用户 nextTick 都推进同一个微任务队列。先 flush 组件渲染（含 `flush: pre` 的 watch），再跑传入 nextTick 的回调。此时 DOM 已 patch，paint 还没发生。`flush: 'post'` 的 watch 更靠后，和 nextTick 接近。

3. 实现原理：降级策略 `Promise.then → MutationObserver → setImmediate → setTimeout(fn, 0)`，都是为了排进微任务 / 尽快的宏任务

Vue2.5 之后优先 `Promise.then`。没有 Promise 再 `MutationObserver`，再 `setImmediate`，最后 `setTimeout(0)`。Vue3 直接假定有 Promise，源码就是 `resolvedPromise.then`。多个 nextTick 回调会合并进同一轮 flush，不会每个都 new 一个 Promise。

4. `await nextTick()` 后一定能拿到最新 DOM 吗？哪些场景可能拿不到？

通常可以。拿不到的情况：回调里又改了数据，下一轮更新还在路上；子组件是异步组件 / `Suspense`，这轮还没挂上；`Teleport` 到外部，时序不同；自己用 `v-if` 刚切出来，子组件的 onMounted 可能在同一轮后面。这种再 `await nextTick()` 一次，或放到 `onMounted`。

## 代码 / 例子

```js
// Vue3
import { ref, nextTick } from 'vue';

const count = ref(0);
const el = ref(null);

async function add() {
  count.value++;
  console.log(el.value.textContent); // 旧值，DOM 还没 patch
  await nextTick();
  console.log(el.value.textContent); // 新值
}
```

## 常见追问

- Q: nextTick 和 setTimeout 相比，回调谁先执行？为什么？
  A: nextTick 先。它走微任务，`setTimeout` 走宏任务。顺序：改数据 → 同步代码 → Vue flush DOM（微任务）→ nextTick 回调 → 其他 then → 才到 timeout。用 timeout 等 DOM 能碰巧成功，但会多等一帧，还可能闪一下旧界面。

## 自己的易错点 / 之前答崩过的地方

我改完数据立刻 `document.getElementById`，以为 Vue 是同步的。Options API 里 `this.x = 1` 同样异步。
`watch` 默认在渲染前跑（Vue3 pre），在 watch 里量 DOM 尺寸会量到旧的，要 `{ flush: 'post' }` 或再 nextTick。
连续 `await nextTick()` 当睡眠用，其实第二下经常空跑，因为没有新的更新队列。
