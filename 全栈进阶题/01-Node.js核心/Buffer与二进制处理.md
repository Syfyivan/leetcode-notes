# Buffer与二进制处理

## 核心回答（面试口述版，1 分钟能讲完）

Buffer 是 Node 拿来处理二进制的字节数组，继承 `Uint8Array`，多了 `writeInt32BE`、`toString('base64')` 这类方法。JS 字符串是 UTF-16，TCP、文件、图片都是字节，必须有一块固定宽度的内存。创建用 `Buffer.alloc(size)`，它会填 0；`allocUnsafe` 不填 0，可能带旧数据，小块还走 8KB pool。编码在 `utf8` / `base64` / `hex` / `latin1` 之间转。

## 展开

1. Buffer 是什么，为什么 Node 需要它

   JS 早期没有字节类型。Node 要对 socket、`fs.read`、加密说话，于是自己做了 Buffer。现在它是 `Uint8Array` 子类，元素 0~255。字符串和 Buffer 互转必须指定编码，默认 `utf8`。半个汉字被截断会出 `�`，要用 `StringDecoder` 做流式解码。

2. alloc 和 allocUnsafe 区别

   - `Buffer.alloc(n)`：分配 n 字节并 `memset` 成 0，安全，稍慢。
   - `Buffer.allocUnsafe(n)`：不清零。n < `Buffer.poolSize / 2`（poolSize 默认 8192，所以阈值 4KB）会从预分配的 pool 切片，更快，但可能读到上次用过的内存。
   - `Buffer.from(str, enc)` / `Buffer.from(array)` 按内容创建。
   - 废弃的 `new Buffer(n)` 行为接近 unsafe，别用。

   对外返回、或会回流到用户的内容，必须 alloc / from；内部马上整块覆写的临时缓冲才考虑 allocUnsafe。

3. 编码转换（utf-8 / base64 / hex）

   `buf.toString('utf8')`、`buf.toString('base64')`、`buf.toString('hex')`。反向 `Buffer.from(s, 'base64')`。`latin1`（binary）是一字节一字符，常拿来在 latin1 字符串和字节之间偷传。`byteOffset` + `length` 可以切 view，不拷贝。注意 `JSON.stringify(buf)` 会变成 `{ type: 'Buffer', data: [...] }`，网络传输一般先改 base64 或直接发 Buffer。

## 代码 / 例子

```js
const a = Buffer.alloc(4);            // <00 00 00 00>
const b = Buffer.allocUnsafe(4);      // 可能是垃圾字节
a.writeUInt32BE(0xdeadbeef, 0);

const s = Buffer.from('你好', 'utf8'); // 6 字节
s.toString('hex');                    // e4bda0e5a5bd
Buffer.from(s.toString('base64'), 'base64').equals(s); // true

// 切片是 view，改 slice 会改原 buf
const view = s.subarray(0, 3);
```

## 常见追问

- Q: Buffer 内存分配在堆内还是堆外？
  A: Buffer 对象在 V8 堆上，字节走 ArrayBuffer 的 backing store。小块 `allocUnsafe` 来自 Node 自己的 8KB C++ pool，这块在 V8 堆外；大块由 V8 分配，超过一定大小会记到 `external_memory`，GC 会把它算进堆压力。所以可以说「数据在堆外、对象在堆内」，但别说 Buffer 完全不受 GC 管。`process.memoryUsage().external` 能看到这块。
- Q: TypedArray/ArrayBuffer 和 Buffer 的关系？
  A: `ArrayBuffer` 是原始字节槽，`TypedArray` / `DataView` 是它的视图。Buffer 是 `Uint8Array` 子类，多了 Node 的编码、pool、`parent` 切片。`Buffer.from(arrayBuffer)` 可以零拷贝包一层。浏览器没有 Buffer，用 `Uint8Array` + `TextEncoder`。

## 自己的易错点 / 之前答崩过的地方

- `allocUnsafe` 直接 `toString` 回给客户端，把其他请求的残留内存泄漏出去。
- `buf.slice` 在旧版是共享内存（现在推荐 `subarray`），改切片等于改原 Buffer。要独立拷贝用 `Buffer.from(buf)`。
- UTF-8 汉字 3 字节，按字节 `buf[i]` 切开再 `toString` 会乱码。流上用 `StringDecoder`。
- 把 `buf.length` 当字符数。它是字节数，`"你好".length === 2` 而 `Buffer.byteLength('你好') === 6`。
