# Vue 生命周期

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. Vue2 的 8 个阶段 + keep-alive 的 2 个：beforeCreate / created / beforeMount / mounted / beforeUpdate / updated / beforeDestroy / destroyed + activated / deactivated
2. Vue3 的命名变化：`setup` 取代 beforeCreate + created；其他都加了 `on` 前缀（onMounted 等）；destroyed → onUnmounted
3. 每个阶段能拿到什么、做什么事最合适：
   - **created**：数据可访问，DOM 没好 → 发请求拿数据
   - **mounted**：DOM 已挂载 → 操作 DOM、初始化插件、绑定事件
   - **beforeUnmount / destroyed**：解绑事件、清定时器、取消订阅
   - **activated / deactivated**：keep-alive 包裹组件的进入与离开
4. 父子组件生命周期的执行顺序（挂载 / 更新 / 销毁 三套）

## 常见追问

- Q: 为什么请求数据放在 created 而不是 mounted？（能早则早，SSR 场景 mounted 不执行）
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
