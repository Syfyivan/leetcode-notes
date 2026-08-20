# Vue2 vs Vue3 响应式原理的区别

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. **Vue2**：`Object.defineProperty` 劫持对象的属性 getter/setter
   - 缺陷：无法监听**新增/删除**属性（需要 `$set / $delete`）；无法监听**数组下标**和**长度**（重写了 7 个数组方法）；深层嵌套要递归到底，初始化开销大
2. **Vue3**：`Proxy` 代理整个对象 + `Reflect`
   - 优势：天然支持新增 / 删除、数组下标与长度；懒代理（首次访问才深层代理）；可以拦截 13 种操作（has、ownKeys、deleteProperty 等）
   - 代价：不支持 IE；返回新对象，必须保持引用
3. 依赖收集时机：getter 中 track；setter 中 trigger

## 常见追问

- Q: Vue3 里 `ref` 和 `reactive` 的区别？各自的响应式是怎么做的？
  A:
- Q: 为什么 Vue3 不用 Object.defineProperty 了？除了新增属性还有别的原因吗？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
