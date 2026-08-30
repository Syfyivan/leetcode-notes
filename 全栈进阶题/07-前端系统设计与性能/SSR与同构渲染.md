# SSR与同构渲染

## 核心回答（面试口述版，1 分钟能讲完）

CSR：浏览器拉 JS 再画页面。SSR：服务器跑一遍组件，吐出 HTML，浏览器再 hydration 把事件接上。同构是同一份组件代码两端跑。SSG 构建期出静态 HTML，ISR 到期再生成。SSR 改善首屏和 SEO；代价是 Node 负载、缓存复杂、以及 hydration 必须和 HTML 对得上，否则 React 会警告并整段重绘。

## 展开

1. CSR/SSR/SSG/ISR 的区别

   | | 何时生成 HTML | 数据 |
   | --- | --- | --- |
   | CSR | 浏览器 | 接口 |
   | SSR | 每次请求 Node | 请求时拉 |
   | SSG | 构建时 | 构建时拉 |
   | ISR | 构建 + 到期再生 | 周期性 |

   文档站 SSG；个性化首页 SSR；后台 CSR。Next.js `getServerSideProps` / `getStaticProps` / `revalidate` 对应后三种。

2. 同构：一套代码跑两端、注水 hydration

   组件里分环境：服务端拼 HTML，客户端 `hydrateRoot` 把已有 DOM 复用，绑定事件，不先清空。数据要嵌进 HTML（`window.__INITIAL_STATE__` 或 RSC payload），客户端才能接着用，避免闪出「无数据」再请求。

3. SSR 的难点（数据预取、状态同步、内存泄漏）

   预取要在渲染前结束，或用流式 `Suspense` / `pipeToNodeWritable` 边下边吐。状态：只序列化需要的字段，注意 XSS（`</script>` 转义）。泄漏：把请求级数据挂模块全局、订阅没卸、LRU 无限涨，Node 进程 RSS 只增不减。每请求新建 store，禁止把 `req` 塞进单例。

## 代码 / 例子

```js
// 同构组件
export function Width() {
  const w = typeof window === 'undefined' ? 0 : window.innerWidth;
  return <span>{w}</span>; // 两端不一致会 hydration mismatch
}

// 正确：客户端再读
const [w, setW] = useState(0);
useEffect(() => setW(window.innerWidth), []);
```

## 常见追问

- Q: hydration 是什么？为什么会有闪烁/不匹配警告？
  A: 把服务端 HTML 变成可交互树的过程。不匹配是两端第一帧文本或结构不同：`Date.now()`、`Math.random()`、`window` 分支、按 Cookie 在客户端才改 class。React 18 发现不一致会丢掉服务端节点在客户端重绘，用户看到闪一下。开发模式有明显 warning。解决：两端同一份数据，浏览器独有逻辑放 `useEffect`。
- Q: SSR 里怎么处理只在浏览器存在的 API（window）？
  A: 渲染路径不要碰 `window/document`。读它放到 `useEffect`、`onMounted`。必须分支时用 `typeof window === 'undefined'`。第三方库没有 SSR 适配就 `dynamic(..., { ssr: false })`。别在模块顶层访问 `localStorage`。

## 自己的易错点 / 之前答崩过的地方

- Vue/React store 做成模块单例，用户 A 的数据渲到用户 B 的 HTML。
- 为了修 mismatch 直接 `dangerouslySetInnerHTML` 整页，等于放弃 hydration。
- SSR 把整站 API 串行 await，TTFB 比 CSR 还慢。数据并行，或能 SSG 的别 SSR。
