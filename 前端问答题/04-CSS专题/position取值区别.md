# position 各取值的区别

## 核心回答（面试口述版，1 分钟能讲完）

`static` 默认，不定位，`top/left/z-index` 都无效。
`relative` 相对自己原来的位置挪，坑还在，后面的元素当它没挪过。
`absolute` 脱离文档流，相对最近的非 static 祖先定位；找不到就相对初始包含块（一般是视口那块）。
`fixed` 相对视口，滚动也不走。祖先有 `transform` / `filter` / `perspective` / `will-change` 时，固定参考会变成那个祖先。
`sticky` 还在流里，到达 `top/left` 阈值后像 fixed 一样吸住，参考的是最近的滚动祖先。
定位元素（非 static）`z-index` 才生效，还会形成层叠上下文。

## 展开

| 值 | 是否脱离文档流 | 定位基准 | z-index 是否生效 | 典型用途 |
| --- | --- | --- | --- | --- |
| static（默认） | 否 | — | 否 | — |
| relative | 否（占坑） | **自身原来位置** | 是 | 作为 absolute 基准、微位移 |
| absolute | **是** | 最近的非 static 祖先；没找到就初始包含块 | 是 | 弹窗、浮层、角标 |
| fixed | **是** | 视口（viewport）；受 transform 祖先影响是个坑 | 是 | 吸顶、固定侧边栏 |
| sticky | 否（阈值前占坑） | 最近的滚动祖先 + top/left/right/bottom 阈值 | 是 | 吸顶导航 |

`sticky` 失效常见原因：没写 `top`（或写 0 以外却忘了）、祖先 `overflow: hidden/auto`、父元素高度刚好等于自己。

## 延伸

- 相关题：居中（absolute + transform）、层叠上下文、fixed 弹窗。
- 对比题：relative 占坑；absolute / fixed 脱离。sticky 阈值前还在流里。
- 面试加码：sticky 失效先看祖先 `overflow`。弹窗用 Portal / Teleport 挂到 body，躲开 transform 包含块。`z-index` 只在同一个层叠上下文里比。

## 常见追问

- Q: 为什么 `position: fixed` 在某些场景下不是相对于视口？（父元素有 transform / perspective / filter 时）
  A: 规范规定：含 `transform` 不是 none 的元素会变成 fixed 的包含块。`filter`、`perspective`、`will-change: transform`、某些 `contain` 也一样。于是滚动的是这个祖先，fixed 跟着它走，表现得像 absolute。弹窗插在被 transform 的动画容器里就会踩这个坑，用 React Portal / Vue Teleport 挂到 `body` 上能躲掉。

- Q: 「包含块（containing block）」是什么？absolute 的包含块如何确定？
  A: 包含块是算 `width/height/top/left` 百分比时的参照矩形。普通 static/relative 块的包含块是父元素的内容区。absolute 往上找：最近一个 `position` 不是 static 的祖先（含 sticky）；还要看 `transform` 等。都没有就用初始包含块，视觉上接近视口。`width: 50%` 的 absolute 元素，50% 是相对这个包含块，不是相对视口（除非包含块就是它）。

## 自己的易错点 / 之前答崩过的地方

吸顶用 `fixed` 还自己算滚动距离。能用 `sticky` 就 sticky，少写 JS。
父级一个 `transform: translateZ(0)` 做 GPU 优化，里面的 `fixed` 菜单跟着页面滚走，我查了很久。
`z-index: 9999` 盖不住，是因为对面先建了层叠上下文（opacity、transform、独立 stacking context），数字只在同一个上下文里比。
