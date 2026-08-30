# Vue 生命周期

## 核心回答（面试口述版，1 分钟能讲完）

Vue2 八个钩子：`beforeCreate` → `created` → `beforeMount` → `mounted` → `beforeUpdate` → `updated` → `beforeDestroy` → `destroyed`。keep-alive 再加 `activated` / `deactivated`。
Vue3 组合式：`setup` 顶替 beforeCreate + created 的时机（更早，props 已经有了）。其余改名加 `on`：`onMounted`、`onBeforeUnmount`、`onUnmounted`。destroyed 改叫 unmounted。
created 能拿 data，DOM 还没有，适合发请求。mounted 才能碰 DOM、初始化图表。销毁时清定时器和监听。
挂载顺序：父 beforeMount → 子完整挂完 → 父 mounted。销毁反过来：父 beforeUnmount → 子卸完 → 父 unmounted。
SSR 没有 mounted，请求放 created / setup 才能在服务端跑。

## 展开

1. Vue2 的 8 个阶段 + keep-alive 的 2 个：beforeCreate / created / beforeMount / mounted / beforeUpdate / updated / beforeDestroy / destroyed + activated / deactivated

beforeCreate：实例刚建，data/methods 还没注入。
created：已注入，可请求数据，`$el` 没有。
beforeMount：模板编译完，马上挂。
mounted：`$el` 就位，子组件也 mounted 了（父的 mounted 在所有子之后）。
beforeUpdate / updated：数据变导致的 DOM patch 前后。updated 里再改数据要小心死循环。
beforeDestroy / destroyed：解绑、清副作用。
activated / deactivated：被 keep-alive 缓存时，进出不走销毁，只走这两个。

2. Vue3 的命名变化：`setup` 取代 beforeCreate + created；其他都加了 `on` 前缀（onMounted 等）；destroyed → onUnmounted

`setup(props, { emit, slots, attrs, expose })` 在 beforeCreate 之前跑，没有 `this`。Options API 的 beforeCreate/created 还在，只是晚于 setup。
对应：`onBeforeMount` `onMounted` `onBeforeUpdate` `onUpdated` `onBeforeUnmount` `onUnmounted` `onActivated` `onDeactivated` `onErrorCaptured` `onServerPrefetch`。
`onRenderTracked` / `onRenderTriggered` 调试用。

3. 每个阶段能拿到什么、做什么事最合适：
   - **created**：数据可访问，DOM 没好 → 发请求拿数据
   - **mounted**：DOM 已挂载 → 操作 DOM、初始化插件、绑定事件
   - **beforeUnmount / destroyed**：解绑事件、清定时器、取消订阅
   - **activated / deactivated**：keep-alive 包裹组件的进入与离开

created / setup 发请求，回来赋值即可。图表、`addEventListener`、`ResizeObserver` 放 mounted，成对的卸在 beforeUnmount。keep-alive 的列表页滚动位置，用 deactivated 记、activated 还。

4. 父子组件生命周期的执行顺序（挂载 / 更新 / 销毁 三套）

挂载：父 beforeCreate → 父 created → 父 beforeMount → **子 beforeCreate → created → beforeMount → mounted** → 父 mounted。
更新（父数据变、子 props 变）：父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated。
销毁：父 beforeDestroy → 子 beforeDestroy → 子 destroyed → 父 destroyed。Vue3 名字换成 Unmount。
记忆：挂载时父等子完成再宣布自己 mounted；销毁时父先说要走，再让子走。

## 延伸

- 相关题：nextTick、keep-alive、SSR 数据预取。
- 对比题：created 能发请求、没有 DOM；mounted 才能碰图表。keep-alive 切走走 deactivated，不是 destroyed。
- 面试加码：挂载时父等子 mounted 再宣布自己；销毁反过来。Vue3 `setup` 早于 beforeCreate。`onErrorCaptured` 知道就行。

## 常见追问

- Q: 为什么请求数据放在 created 而不是 mounted？（能早则早，SSR 场景 mounted 不执行）
  A: created 更早，DOM 不挡请求。SSR 时组件在服务端跑完 created/setup 就序列化状态，mounted 只在浏览器执行，放 mounted 服务端拿不到数据。客户端两者时间差很小，习惯仍放 setup/created。注意：请求返回时组件可能已销毁，要有取消（AbortController）或 `if (!vm)` 判断。

## 自己的易错点 / 之前答崩过的地方

keep-alive 我以为切走会 destroyed。其实只 deactivated，定时器还在跑，必须在 deactivated 里停。
父 mounted 里去读子的 DOM，以为子还没挂。其实子已经 mounted 了，反过来才对。
`updated` 里改数据触发下一次 updated，没加条件就循环。该用 `watch`。
