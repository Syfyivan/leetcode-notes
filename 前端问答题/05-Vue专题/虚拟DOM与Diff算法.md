# 虚拟 DOM 与 Diff 算法

## 核心回答（面试口述版，1 分钟能讲完）

虚拟 DOM 是用 JS 对象描述真实 DOM。改数据时先生成新树，Diff 出最小补丁再动真实 DOM。
真实 DOM 有属性、布局、监听，操作很贵。对象比对便宜，还能把多次改动合成一次。
Diff 只比同层，不跨层挪节点。类型不同就整棵拆掉重建。
Vue2 子节点用双端比较：新旧两对头尾指针，最多四次对比，对不上再查 key。
Vue3 编译期就标出动态节点（PatchFlag），静态的跳过。剩余带 key 的乱序用最长递增子序列减少移动。
key 是同层节点的身份。用 index 当 key，列表中间插入会错复用，输入框状态会串。

## 展开

1. 虚拟 DOM 的定义（JS 对象描述真实 DOM）和 3 个收益：跨平台 / Diff 后最小化操作 / 声明式编程心智负担

典型节点：`{ type, props, children, key }`。同一套 VNode 可以落到浏览器 DOM、小程序、Native（Weex 老方案）。模板是声明式，框架算 diff。收益是「少碰真实 DOM + 声明式」，不是「任何情况都比手写 DOM 快」。

2. Diff 的**同层比较**原则（深度优先，不跨层）

父节点类型相同才比子节点。A 的儿子不会跑去和 B 的儿子跨层复用。复杂度从 O(n³) 降到 O(n)。树深度方向递归（Vue3 是迭代 + 栈），每层再线性扫 children。

3. **Vue2 Diff**：双端比较（4 次首尾比对）→ 找最长递增子序列确定最小移动

Vue2 没有 LIS。那是 Vue3 的。Vue2 四个指针：`oldStart` / `oldEnd` / `newStart` / `newEnd`。
先比头头、尾尾、头尾、尾头。命中就 patch 并挪指针。四次都不中，用 old 的 key → index 表定位。找到就 patch 并挪 DOM，找不到就新建，多余的删。没有 key 时只能按位置硬比，列表中间插入会大面积复用错。

4. **Vue3 Diff 优化点**：
   - 静态节点提升 / 静态属性提升（PatchFlag）
   - 事件缓存
   - 动态节点用 Block Tree 收集，只比较动态部分
   - 最长递增子序列移动 + 双端指针综合

编译器把静态 vnode 提到 render 外面复用。动态 prop 打 PatchFlag，更新时只看 class/style/文本这些位。`cacheHandlers` 让内联事件不每次换新函数。Block 把动态子节点收成扁平列表。带 key 的乱序：先从两端对齐相同前缀后缀，中间那段算 LIS，在 LIS 上的节点不挪，其他的才 insertBefore。

## 延伸

- 相关题：响应式 trigger 之后的更新、React Diff / Fiber。
- 对比题：同层比，不跨层挪节点。类型不同整棵拆。Vue2 双端，LIS 是 Vue3 的。
- 面试加码：列表排序、插入必须用稳定 id 当 key。手写简化 `h` + patch 能讲清楚就够。React 也靠 key，坑一样。

## 代码 / 例子

```js
function h(type, props, children) {
  return { type, props: props || {}, children: children || [] };
}

function diff(oldN, newN, el) {
  if (oldN.type !== newN.type) {
    const n = document.createElement(newN.type);
    el.replaceWith(n);
    return n;
  }
  // 同类型：只改变了的 prop
  for (const k in newN.props) {
    if (oldN.props[k] !== newN.props[k]) el.setAttribute(k, newN.props[k]);
  }
  // 子节点按索引比（无 key 的简化版）
  const max = Math.max(oldN.children.length, newN.children.length);
  for (let i = 0; i < max; i++) {
    if (!oldN.children[i]) el.appendChild(/* create(newN.children[i]) */);
    else if (!newN.children[i]) el.removeChild(el.childNodes[i]);
    else diff(oldN.children[i], newN.children[i], el.childNodes[i]);
  }
}
```

## 常见追问

- Q: key 的作用是什么？为什么不能用 index 作 key？
  A: key 让 Diff 认出「这是原来那一项」，才能复用节点和内部状态（输入框、组件实例）。index 当 key 时，中间插入/删除会导致后面每一项 key 都变，Vue 当成「内容变了但身份还是第 i 个」，DOM 复用了，里面的状态错位。列表会排序、插入、删除就必须用稳定 id。纯静态列表用 index 问题不大。

- Q: 虚拟 DOM 一定比直接操作真实 DOM 快吗？（否，极端场景反例）
  A: 不快。一次改一个文本节点，手写 `el.textContent = x` 最少功。虚拟 DOM 还要建新树、diff、再 patch。它赢在：大量更新能合并；开发者不用手算补丁；跨平台。表格一万格每格都变，虚拟 DOM 开销会很明显，这种才上局部直接操作或 WebGL。

## 自己的易错点 / 之前答崩过的地方

我把「最长递增子序列」安在 Vue2 头上。Vue2 是双端，LIS 是 Vue3。
`v-for` 用 index，表单填到一半排序，输入内容跟着行跑。
以为虚拟 DOM 是 Vue 独有。React 先做的，Snabbdom、Preact、小程序都是这套思路。
