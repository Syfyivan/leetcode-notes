# BFC（块级格式化上下文）

## 核心回答（面试口述版，1 分钟能讲完）

BFC 是一块独立的渲染区域。里面的盒子按块布局，外面的布局算不到里面来，里面的浮动也漏不出去。
最常用的触发方式：`overflow: auto/hidden`、`display: flow-root`、`display: flex/grid/inline-block`、`position: absolute/fixed`、根元素 html。
三件实事：① 父元素包住内部浮动，不再高度塌陷；② 两个 BFC 之间的 margin 不和对方折叠；③ 和浮动并排时自己形成自适应栏，文字不会围上去。
现在清浮动优先 `display: flow-root` 或 flex，少用清浮动 hack。
面试问「两栏自适应、左边浮动」就是右边开 BFC。

## 展开

1. BFC 的定义（独立渲染区域，内部元素布局不影响外部，反之亦然）

Formatting Context 是一套排版规则。BFC 里：块盒从上往下排，垂直 margin 可能折叠，浮动元素也参与这个区域的高度计算。不同 BFC 之间互不打扰，浮动出不去，外边距不跨边界折叠。

2. 触发 BFC 的条件（至少 5 种，记最常用的：`overflow: hidden/auto/scroll`；`display: flow-root/inline-block/flex/grid`；`position: absolute/fixed`；根元素 `<html>`）

- 根元素
- `float` 不是 `none`
- `position` 为 `absolute` / `fixed`
- `display: inline-block` / `table-cell` / `table-caption` / `flow-root` / `flex` / `inline-flex` / `grid`
- `overflow` 不是 `visible`（`hidden` / `auto` / `scroll`）
- `contain: layout` / `content` / `paint`

`overflow: hidden` 会裁切和可能出滚动条，副作用大。单纯为了 BFC 用 `flow-root`。flex/grid 实际建的是 FFC/GFC，效果上也能包住浮动、挡住 margin 折叠。

3. BFC 的三大能力 / 能解决的问题：
   - 清除内部浮动（父元素塌陷）
   - 防止兄弟 margin 折叠（塌陷）
   - 阻止文字环绕浮动 / 自适应两栏布局

父元素只有浮动子元素时高度是 0。父元素变成 BFC 后，计算高度会把浮动算进去。
相邻兄弟的垂直 margin 取最大值，不是相加。其中一个包进 BFC（或加 padding/border）就断开折叠。
左边 `float:left`，右边 `overflow:auto` 开 BFC，右边整块在浮动旁边，不会被文字环绕成狗牙状。

## 延伸

- 相关题：盒模型 margin 折叠、float 两栏、Flex/Grid。
- 对比题：`overflow:hidden` 能开 BFC 但会裁切弹出层；单纯清浮动用 `flow-root`。flex 项之间不走这块 margin 折叠规则。
- 面试加码：左边 float、右边 overflow 开 BFC，就是自适应两栏。伪元素 `clear:both` 能清浮动，本身不是 BFC。

## 代码 / 例子

```css
/* 1. overflow，副作用是裁切 */
.wrap { overflow: auto; }

/* 2. 专门为 BFC 设计，无裁切 */
.wrap { display: flow-root; }

/* 3. 伪元素清浮动（不是 BFC，但是老办法） */
.wrap::after {
  content: '';
  display: block;
  clear: both;
}

/* 两栏：左固定右自适应 */
.left { float: left; width: 200px; }
.right { overflow: auto; } /* 自己成 BFC，不环绕 */
```

## 常见追问

- Q: IFC、GFC、FFC 了解吗？（能答就加分，不会也没关系）
  A: IFC 是行内格式化上下文，`<span>`、文字在一行里排，垂直对齐靠 `line-height` / `vertical-align`。FFC 是 flex 容器建的弹性格式化上下文。GFC 是 grid。面试说到「包住浮动、挡住 margin 折叠」，flex/grid 也能做到，不必死抠名字是不是 BFC。知道根元素、overflow、flow-root 三件套就够应付大多数追问。

## 自己的易错点 / 之前答崩过的地方

我用 `overflow: hidden` 当万能清浮动，把内部 `position:absolute` 弹出的层裁掉了。改 `flow-root`。
margin 折叠我以为只有兄弟。父子之间、空块自己上下 margin 也会折。
把 `float` 本身忘了也会开 BFC。浮动元素自己就是一个 BFC。
