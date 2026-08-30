# 盒模型与 box-sizing

## 核心回答（面试口述版，1 分钟能讲完）

盒模型就是内容 + padding + border + margin。宽高到底算哪一段，看 `box-sizing`。
默认 `content-box`：`width` 只是内容。padding 和 border 往外加，最终占位比你写的 width 大。
`border-box`：`width` 含内容、padding、border。padding 往里挤内容。布局好算。
项目里几乎都会写 `*, *::before, *::after { box-sizing: border-box }`。
`width: 100px; padding: 20px; box-sizing: border-box` 时，左右 padding 共 40px，内容区 60px。
margin 不进 width，还是在盒子外面，而且可能折叠。

## 展开

1. 两种盒模型：
   - **content-box（W3C 标准盒模型）**：宽高 = content，padding / border 往外撑
   - **border-box（IE 盒模型 / 怪异模式）**：宽高 = content + padding + border，整体尺寸可控

content-box 下 `width:200px; padding:20px; border:10px solid`，实际占宽 200+40+20=260。
border-box 下同样声明，占宽就是 200，内容只剩 200-40-20=140。margin 两种都不算进 width。

2. box-sizing 三个取值：content-box / border-box / padding-box（已废弃）

就这两个活着。`padding-box` 曾经出现在草案，浏览器基本没跟上，别在面试里展开。继承默认是 content-box，所以要全局重置。

3. 为什么大家都在全局设 `* { box-sizing: border-box }`？写布局时到底好在哪？

栏宽、`width: 50%`、`width: 100%` 再加 padding 不会把容器撑破。设计稿给的是边框到边框的尺寸，和 border-box 对得上。input、button 的 UA 样式经常已经是 border-box，全局统一能少混用。

4. `box-sizing: border-box` 下，设置了 `width: 100px` 再设置 `padding: 20px`，最终 content 区有多宽？

左右各 20，共 40。没写 border 就当 0。内容宽度 60px。高度同理：`padding: 20px` 是四边，内容高度也减 40。

## 常见追问

- Q: 外边距折叠（margin collapse）的三种场景 + 解决思路？
  A: ① 相邻兄弟块的垂直 margin 取较大值。② 父子：父没有 padding/border/BFC，第一个/最后一个子的垂直 margin 会「穿出」父元素。③ 空块自己的上下 margin 折在一起。水平 margin 不折叠。断开办法：父加 padding 或 border、父开 BFC（`flow-root` / `overflow:auto`）、用 flex/grid（弹性/网格项之间不走这块规则）、改用 gap。

## 自己的易错点 / 之前答崩过的地方

百分比 width 我按 content-box 心算，加完 padding 换行了才想起没改 box-sizing。
`width: 100%` 再 `padding` 在 content-box 下会溢出，我当时怪 margin。
margin 折叠只记得兄弟，父子穿出把背景位置搞乱，查了半天才发现父高度没把子 margin 算进去。
