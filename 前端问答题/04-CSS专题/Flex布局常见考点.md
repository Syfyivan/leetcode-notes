# Flex 布局常见考点

## 核心回答（面试口述版，1 分钟能讲完）

父元素 `display: flex` 之后，子项沿主轴、交叉轴排。默认主轴水平、不换行、子项不拉伸宽度但交叉轴 stretch。
容器常用：`flex-direction`、`flex-wrap`、`justify-content`、`align-items`、`align-content`。
子项常用：`flex-grow / shrink / basis`、`order`、`align-self`。
`flex: 1` 等于 `1 1 0%`，大家从 0 开始按比例分剩余空间，等分很稳。
子项默认 `min-width: auto`，内容太长会撑破容器，要加 `min-width: 0` 或 `overflow: hidden`。
主轴两端对齐用 `space-between`，最后一行数量不够会很难看，九宫格用 wrap + 百分比或 grid 更干净。

## 展开

1. Flex 容器的 6 大属性：flex-direction / flex-wrap / flex-flow / justify-content / align-items / align-content

- `flex-direction: row | row-reverse | column | column-reverse` 定主轴。
- `flex-wrap: nowrap | wrap | wrap-reverse`。
- `flex-flow` 是前两个的缩写。
- `justify-content` 管主轴：`flex-start` / `center` / `space-between` / `space-around` / `space-evenly`。
- `align-items` 管单行交叉轴：`stretch`（默认）/ `center` / `flex-start` / `baseline`。
- `align-content` 管多行在交叉轴上的分布，只有换行了才生效。

2. Flex 子项的 6 大属性：order / flex-grow / flex-shrink / flex-basis / flex / align-self

- `order` 默认 0，越小越靠前，只影响视觉顺序，键盘顺序不变。
- `flex-grow` 剩余空间怎么分，默认 0。
- `flex-shrink` 不够时怎么缩，默认 1。
- `flex-basis` 初始主轴尺寸，默认 `auto`（看 width/height 或内容）。
- `flex` 是 grow/shrink/basis 的缩写。
- `align-self` 覆盖容器的 `align-items`。

3. `flex: 1` 等价于什么？（`flex-grow:1; flex-shrink:1; flex-basis:0%`）

规范里 `flex: 1` = `1 1 0%`。`flex: auto` = `1 1 auto`。`flex: none` = `0 0 auto`。
basis 是 0 时，剩余空间按 grow 比例分，跟内容宽度无关，三列真等宽。basis 是 auto 时先按内容占位再分剩余，内容多的那列会更宽。

4. `flex-basis` 和 `width` 的优先级关系？和 `min-width/max-width` 的关系？

主轴是水平时：`flex-basis` 不是 auto 就用 basis，忽略 width。basis 是 auto 才回退到 width，再没有就用内容尺寸。
`min-width` / `max-width` 是硬限制，压过 grow/shrink/basis。默认 `min-width: auto` 等于「不能比内容更窄」，所以缩不下去。

5. 常见布局：两端对齐（space-between 左右溢出怎么办？）、最后一项左对齐、等分布局 + 间距

`space-between` 子项自身太宽会溢出，给子项 `min-width: 0` 并允许换行。最后一行左对齐：不要用 between，用 `gap` + `flex-start`，或伪元素占位，或改 grid。等分：子项 `flex: 1` + 容器 `gap: 16px`，别用 margin 硬凑。

## 延伸

- 相关题：垂直水平居中、Grid 九宫格、盒模型。
- 对比题：`justify-content` 管主轴，`align-items` 管交叉轴。`align-content` 只对多行有效。
- 面试加码：`gap` 替代子项 margin。`order` 只改视觉顺序，键盘顺序不变。粘性页脚：column + main `flex: 1`。

## 代码 / 例子

```css
/* 粘性页脚：内容不足时 footer 贴底 */
body { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }

/* 三栏圣杯：左右固定，中间自适应 */
.holy { display: flex; }
.holy .side { width: 200px; flex: none; }
.holy .content { flex: 1; min-width: 0; }

/* 九宫格 */
.grid9 { display: flex; flex-wrap: wrap; }
.grid9 > div { width: 33.33%; aspect-ratio: 1; }
```

## 常见追问

- Q: 子项内容太长撑破 Flex 容器怎么办？（`min-width: 0` 或 `overflow: hidden`）
  A: Flex 项默认 `min-width: auto`，内容的最小尺寸被当成下限，`flex-shrink` 失效。文字省略还要再加 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`。纵向 flex 同理是 `min-height: 0`。嵌套 flex 每一层都可能要设一次。

## 自己的易错点 / 之前答崩过的地方

`flex: 1` 我答成 `1 1 auto`。那是 `flex: auto`。等分列必须是 basis 0。
文字溢出我只加 ellipsis，不加 `min-width: 0`，怎么写都不省略。
`align-content` 在单行容器上调半天没反应，忘了它只对多行有效。
