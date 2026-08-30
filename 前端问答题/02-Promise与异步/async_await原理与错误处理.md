# async / await 原理与错误处理

## 核心回答（面试口述版，1 分钟能讲完）

`async` 函数一定返回 Promise。你 `return 123`，外面拿到的是 `Promise.resolve(123)`；里面 throw，外面就是 rejected。
`await` 两件事：把右边包成 Promise，然后暂停这个函数，等它敲定再从断点恢复。
恢复后的代码排在微任务里，等价于 `Promise.then`。
写法像同步，错误用 `try/catch` 就能接到 await 的 reject。
`.then` 链在循环里很丑，`for` + `await` 能串行；想并行要先 `map` 出 Promise 再 `await Promise.all`。
没人 catch 的 async 拒绝会打到 `unhandledrejection`。

## 展开

1. async 函数本质上返回什么？写了 `return 123` 外面拿到的是什么？

返回 Promise。`return 123` → 这个 Promise fulfilled，值 123。`return p` 且 p 是 Promise，就采用 p。没有 return → fulfilled 的 `undefined`。调用 `async` 函数当下就得到这个 Promise，函数体先同步跑到第一个 await。

2. await 做了哪两件事？（暂停执行 + 等待 Promise settle + 恢复）

① 对右边做 `Promise.resolve`（thenable 会拆）。② 暂停当前 async 函数，把「后续」注册成微任务，把线程交出去。Promise fulfilled 后用值当 await 表达式的结果继续跑；rejected 就在 await 那一行抛错。

3. async/await 相比 `.then` 链的优势（同步写法、错误栈、调试、循环控制）

能直接写 `const a = await f(); const b = await g(a)`，不用金字塔。`try/catch` 覆盖多段 await。断点、调用栈更可读。`for` / `while` 里 await 是真串行；`.then` 要靠递归或 `reduce`。代价是一不小心就串行过慢，该 `all` 的时候别一个个 await。

4. 错误处理三种模式：try/catch、`.catch`、顶层 `unhandledrejection`

- 函数内部 `try/catch`：能按分支恢复，返回兜底值。
- 调用方 `foo().catch(...)`：管整段 async 的拒绝。
- `window.addEventListener('unhandledrejection', ...)` 或 Node `process.on('unhandledrejection')`：最后兜底，用于上报。接到后调用 `event.preventDefault()` 能挡住浏览器默认日志。

三种可以叠，catch 了就不会再进 unhandledrejection。

## 代码 / 例子

```js
async function load() {
  const ids = [1, 2, 3];

  // for：真串行，每次等上一次
  for (const id of ids) {
    await fetch('/item/' + id);
  }

  // forEach：回调是独立 async，await 拦不住外层
  // load 会立刻走完，请求在飞，错误也 catch 不到
  ids.forEach(async (id) => {
    await fetch('/item/' + id);
  });

  // 并行：先发出去再一起等
  await Promise.all(ids.map((id) => fetch('/item/' + id)));
}
```

## 常见追问

- Q: `await` 后面接非 Promise 值会怎样？
  A: 等价 `await Promise.resolve(值)`。当下这个 async 函数仍然会暂停，后续代码进微任务。所以 `await 1` 后面的 `console.log` 一定晚于当前同步代码。想同步就别 await 一个普通值。

- Q: async 函数里的异常和 Promise reject 的关系？
  A: 没接到的 throw（含 await 到的 reject）会变成返回 Promise 的 reject。`try/catch` 接到就吞掉，返回 Promise 仍是 fulfilled。构造函数里不能是 async，`new` 要同步拿到实例。

## 自己的易错点 / 之前答崩过的地方

我在 `forEach` / `map` 里写 `await`，以为外层会等。`forEach` 根本不处理返回值。
并行请求写成 `await a(); await b();`，两个独立请求被我串行化，首屏多等一截。
`try { return await p } catch` 和 `return p` 不一样：后者把 p 直接交出去，这个函数自己的 catch 接不住 p 的失败。
