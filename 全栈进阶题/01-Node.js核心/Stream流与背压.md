# Stream流与背压

## 核心回答（面试口述版，1 分钟能讲完）

Stream 把数据切成 chunk 边读边处理，避免一次性进内存。四种：Readable、Writable、Duplex、Transform。背压是生产者比消费者快时，读侧必须停下来。`pipe()` / `pipeline()` 会盯着 `write()` 的返回值，写缓冲超过 `highWaterMark` 就暂停读，等 `'drain'` 再继续。大文件、HTTP body、gzip 都该走流。

## 展开

1. 四种流类型（Readable/Writable/Duplex/Transform）

   - **Readable**：`fs.createReadStream`、`req`。数据从内部缓冲往外推或拉。
   - **Writable**：`fs.createWriteStream`、`res`。`write(chunk)` / `end()`。
   - **Duplex**：两端都能读写，TCP `net.Socket` 就是。读和写各有自己的缓冲。
   - **Transform**：Duplex 的特例，写入即变换后读出。`zlib.createGzip()`、`crypto.createCipheriv()`。

   对象模式 `objectMode: true` 时 chunk 可以是任意 JS 值，`highWaterMark` 默认 16 个对象；字节流默认 16KB（Readable）/ 16KB（Writable）。

2. 背压（backpressure）是什么，pipe 怎么自动处理

   `writable.write(chunk)` 返回 `false`，表示内部缓冲（`writableLength`）已经摸到 `highWaterMark`。这时 Readable 必须停，否则 chunk 堆在内存里。`readable.pipe(writable)` 内部就是：写失败则 `readable.pause()`，等 writable 发 `'drain'` 再 `resume()`。Node 15+ 推荐 `stream.pipeline(a, b, c, cb)`，错误会拆掉整条链，避免泄漏。

3. flowing 和 paused 两种读取模式

   Readable 默认 **paused**：你调 `read()` 才吐数据，或监听 `'readable'` 再 `read()`。一旦 `on('data')` 或 `resume()`，切到 **flowing**，数据主动推给 `'data'` 回调。`pause()` 回到 paused。`readableFlowing === null` 表示还没选定。现代写法更常用 `for await (const chunk of readable)`，它按 paused / 内部 pull 走，背压由 async iterator 带上。

## 代码 / 例子

```js
const fs = require('fs');
const { pipeline } = require('stream');
const zlib = require('zlib');

pipeline(
  fs.createReadStream('big.log'),
  zlib.createGzip(),
  fs.createWriteStream('big.log.gz'),
  (err) => console.log(err || 'done'),
);

// 手动背压
const rs = fs.createReadStream('in.bin');
const ws = fs.createWriteStream('out.bin');
rs.on('data', (chunk) => {
  if (!ws.write(chunk)) rs.pause();
});
ws.on('drain', () => rs.resume());
rs.on('end', () => ws.end());
```

## 常见追问

- Q: 为什么大文件读取用 stream 而不是 readFile？
  A: `fs.readFile` 把整个文件读进一块 Buffer，2GB 文件就直接顶内存，V8 还有 ArrayBuffer 上限。Stream 每次只持有几个 `highWaterMark` 大小的 chunk，边读边写或边 hash。HTTP 上传、复制、压缩都是这个理由。
- Q: 手动实现背压要监听哪些事件（drain）？
  A: 看 `write()` 返回值。`false` 就停读（`pause()` 或别再 `read()`），监听 writable 的 `'drain'` 再继续。还要处理 `'error'` 和 `'finish'`/`'end'`，漏了会把文件描述符挂住。用 `pipeline` 就不用自己拼这套。

## 自己的易错点 / 之前答崩过的地方

- 只 `on('data')` 不处理 `write() === false`，上传大文件把内存打满，还以为 Stream 自动安全。
- `pipe` 遇到中间流报错不会自动销毁整条链，源文件一直占着 fd。改用 `pipeline`。
- 把 `'readable'` 和 `'data'` 同时绑上，模式来回切，漏数据。
- `highWaterMark` 调太大等于变相 `readFile`，背压形同虚设。
