# Vue2 vs Vue3 响应式原理的区别

## 核心回答（面试口述版，1 分钟能讲完）

Vue2 用 `Object.defineProperty` 拦每个属性的 get/set。初始化要把对象递归走完。
拦不到新增、删除，数组下标和 `length` 也拦不到。所以有 `$set` / `$delete`，以及重写的 7 个数组方法。
Vue3 用 `Proxy` 拦整个对象，13 种操作都能拦，新增、删除、下标、`in`、`delete` 都在里面。
Vue3 是懒代理：属性被访问到才递归包一层，初始化更轻。
依赖收集：get 的时候 `track`，set 的时候 `trigger`。Vue3 用 `targetMap`（WeakMap）存依赖。
代价是 Proxy 不支持 IE。Proxy 返回的是新对象，必须一直用代理后的引用。

## 展开

1. **Vue2**：`Object.defineProperty` 劫持对象的属性 getter/setter
   - 缺陷：无法监听**新增/删除**属性（需要 `$set / $delete`）；无法监听**数组下标**和**长度**（重写了 7 个数组方法）；深层嵌套要递归到底，初始化开销大

`defineProperty` 针对「已有 key」。`obj.x = 1` 新 key 没有 getter/setter。数组 `arr[0] = x`、`arr.length = 0` 同样绕开。
7 个变异方法：`push` `pop` `shift` `unshift` `splice` `sort` `reverse`。它们改完再手动 notify。`arr[i] =` 和 `length` 赋值仍然无响应。
`Vue.set(obj, key, val)` 内部是补 defineProperty 再通知。对象 key 太多时，启动阶段递归 define 会卡。

2. **Vue3**：`Proxy` 代理整个对象 + `Reflect`
   - 优势：天然支持新增 / 删除、数组下标与长度；懒代理（首次访问才深层代理）；可以拦截 13 种操作（has、ownKeys、deleteProperty 等）
   - 代价：不支持 IE；返回新对象，必须保持引用

`Reflect.get/set` 配 receiver，能把 this 指到代理对象，避免原型链上取值丢响应。
`reactive` 只接受对象。原始值用 `ref`，`.value` 的 get/set 再走 track/trigger。
把 `reactive` 对象解构出来是普通值，要 `toRefs`。`ref` 在模板里自动拆 `.value`。

3. 依赖收集时机：getter 中 track；setter 中 trigger

组件 effect（或 `watchEffect`）运行时，读到的每个响应式属性把当前 effect 记进自己的 dep。数据变了，遍历 dep 重新跑。Vue3 的 `computed` 也是带调度的 effect，懒计算、有缓存。Vue2 是 `Dep` 类 + `Watcher`，思路一样，API 不同。

## 常见追问

- Q: Vue3 里 `ref` 和 `reactive` 的区别？各自的响应式是怎么做的？
  A: `ref` 包一层 `{ value }`，对象会再交给 `reactive`。模板和 `reactive` 里的属性访问会自动拆包。`reactive` 直接 Proxy，不能包 `1` / `true`。`ref` 可以换掉整个 `.value`；`reactive` 换整个对象要重新包，一般用 `Object.assign` 或干脆 ref。脚本里 `ref` 必须 `.value`，漏了是面试高频坑。

- Q: 为什么 Vue3 不用 Object.defineProperty 了？除了新增属性还有别的原因吗？
  A: 还有：数组下标、`delete`、`in`、`Object.keys` 在 Vue2 里都不完整；初始化必须递归，大对象贵；`defineProperty` 改的是原对象，Vue3 的 Proxy 可以不污染原对象（`readonly` 也更好做）。Map/Set 在 Vue2 无响应，Vue3 专门拦了它们的方法。IE 放弃之后没有理由再绑手脚。

## 自己的易错点 / 之前答崩过的地方

Vue2 里我写 `this.list[0] = x` 界面不更新，只会说「数组要 7 个方法」，没把「下标赋值」单独拎出来。
Vue3 把 `const { name } = props` 或 `reactive` 对象解构后当响应式用，值不再更新。
`ref` 在脚本里忘了 `.value`，比较永远是对象对数字，逻辑假死。
