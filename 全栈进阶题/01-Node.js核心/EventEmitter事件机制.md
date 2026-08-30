# EventEmitter事件机制

## 核心回答（面试口述版，1 分钟能讲完）

Node 的异步 I/O 通知大多挂在 `EventEmitter` 上：`on` 注册，`emit` 同步按注册顺序把监听器跑完。`once` 跑完即删，`off` / `removeListener` 按函数引用移除。它是进程内的发布订阅，没有浏览器那套捕获冒泡。`error` 事件如果没人听，会当成未捕获异常往外抛，可能把进程打挂。默认同一事件最多 10 个监听器，超了打 `MaxListenersExceededWarning`，这是防泄漏的信号。

## 展开

1. on/emit/once/removeListener 的用法

   - `on(event, fn)` / `addListener`：追加。`prependListener` 插到队列头。
   - `emit(event, ...args)`：同步调用当前数组里的监听器，返回是否有人监听。
   - `once`：内部包一层，第一次 emit 后 `removeListener`。
   - `removeListener(event, fn)` 必须传入同一个函数引用；匿名函数卸不掉。
   - `removeAllListeners(event?)` 清空。`eventNames()` / `listenerCount()` 排查用。

   Stream、`net.Socket`、`process`、`cluster` 都继承它。自己写也可以 `class Foo extends EventEmitter {}`。

2. 同步触发还是异步触发

   **同步**。`emit` 期间监听器一个接一个跑，跑完才返回。监听器里再 `emit` 会重入。需要异步就自己 `process.nextTick` 或 `queueMicrotask` 包一下，Node 自己的 `'error'` 也是同步抛。这点和浏览器 DOM 事件「同步分发」一致，但没有事件对象、没有 `stopPropagation`。

3. 内存泄漏（监听器超过默认上限）警告

   `defaultMaxListeners = 10`。同一 event 超过 10 个，`process` 打警告。常见原因：HTTP 请求里每次 `socket.on('data', ...)` 却不在结束时 `off`；或者热重载重复 `on`。`setMaxListeners(0)` 等于关掉保险丝，排查清楚再改。监听器闭包如果抓着大对象，emitter 活多久，那些对象就活多久。

## 代码 / 例子

```js
const { EventEmitter } = require('events');
const bus = new EventEmitter();

function onTick(n) {
  console.log('tick', n);
}
bus.on('tick', onTick);
bus.once('tick', () => console.log('once'));
bus.emit('tick', 1); // 两个都跑，同步
bus.emit('tick', 2); // 只剩 onTick
bus.off('tick', onTick);

bus.emit('error', new Error('boom')); // 没人听 error → 抛错
```

## 常见追问

- Q: EventEmitter 和浏览器的 addEventListener 有什么本质区别？
  A: 都是同步分发的观察者。差别在模型：EventEmitter 按事件名存函数数组，参数你随便传；DOM 有捕获 / 目标 / 冒泡三阶段、`Event` 对象、`stopPropagation` / `preventDefault`。浏览器一个元素可以有多个同名监听且有 options（`once`、`passive`、`signal`）；Node 靠函数引用去重卸载。EventEmitter 不跨进程、不进事件循环排队，`emit` 就在当前栈上跑完。
- Q: 错误事件 error 不监听会怎样？
  A: `emit('error', err)` 发现监听器列表为空，直接 `throw err`。在 EventEmitter 调用栈里抛，没人 try-catch 就进 `uncaughtException`，旧版 Node 默认干掉进程。给 emitter 至少挂一个 `on('error')`，Stream 尤其要挂，不然 `pipeline` 之外的裸 pipe 一出错就崩。

## 自己的易错点 / 之前答崩过的地方

- 把 `emit` 想成下一轮事件循环才跑，结果监听器里改的状态在 `emit` 返回后已经变了。
- `once` 和 `on` 混用，测试里第二次 emit 还在等。
- 用箭头函数 `on` 之后 `off(同名新箭头)`，引用不同，卸不掉，监听器堆积到 11 个才看到警告。
- 在 `emit` 的监听器里 `on`/`off` 同一事件：Node 会拷当前监听器列表再调，但写起来很容易乱序，别在分发过程中改订阅。
