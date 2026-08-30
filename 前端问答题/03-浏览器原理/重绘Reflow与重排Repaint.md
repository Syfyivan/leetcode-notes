# 重排（Reflow）与重绘（Repaint）

> 文件名英译写反了：Reflow = 重排，Repaint = 重绘。下面按这个口径。

## 核心回答（面试口述版，1 分钟能讲完）

重排是重新算几何：位置、大小、结构变了都要走。重绘是重新画外观：颜色、阴影、可见性。
重排一定带着重绘，重绘不一定重排。
改 `width` / `height` / `left` / `font-size` / 增删 DOM 会重排。改 `color` / `background` 只重绘。改 `transform` / `opacity` 往往只合成。
浏览器会把样式改动攒一攒再刷。但你中间去读 `offsetHeight`、`getComputedStyle`，它就被迫立刻布局，叫强制同步布局。
优化：读写分离、批量改 class、用 `DocumentFragment`、动画走 transform、少用 table 布局。

## 展开

1. 重排 & 重绘的定义和触发条件 —— 重排一定触发重绘，重绘不一定重排

重排（Reflow / Layout）：Render Tree 上节点的几何变了，要重新走 Layout。影响范围可能是整棵树，也可能从某个子树往下。
重绘（Repaint）：几何没变，外观变了，按已有布局重新生成绘制指令。
合成层上改 transform 连重绘都可能省掉。

2. 常见触发重排的操作（至少 6 条）

- 改尺寸：`width` / `height` / `padding` / `border` / `margin`
- 改位置：`left` / `top`、`flex` 方向、`float`
- 改内容：文字变化、图片加载撑开
- 改结构：增删节点、改 `display`
- 改字体：`font-size` / `font-family` / `line-height`
- 读几何：`offsetWidth`、`scrollTop`、`clientHeight`、`getBoundingClientRect()` 可能强制刷
- 窗口 resize、显示滚动条

3. 浏览器的「批量更新队列」和 flush 机制（读写分离、读操作会强制刷新）

写样式时浏览器先记脏标记，当前帧结束再一次性布局。循环里连续写 `el.style.width` 通常只排一次。
读几何必须给最新值，于是立刻 flush 队列。循环里「写、读、写、读」就会每轮都布局一次，这就是 Forced Synchronous Layout / layout thrashing。

4. 优化方法（至少 5 条）：分离读 / 写、类名批量改、文档片段、虚拟 DOM、will-change、transform 动画等

- 先把要读的几何一次读完，再集中写。
- 改一个 class，不要逐条改 style。
- 离线操作：`display:none` 再改（none 的子树不布局），或 `DocumentFragment` 拼好再挂。
- 虚拟 DOM / 框架也是把改动攒成一次 patch。
- 动画用 `transform` / `opacity`，必要时 `will-change`，用完删掉。
- 长列表虚拟滚动，别一次插一万个节点。

## 延伸

- 相关题：渲染流程、合成层、Flex/动画性能。
- 对比题：`visibility` 只重绘；`display:none` 会重排。改 `transform` 往往只走合成。
- 面试加码：循环里读 `offsetHeight` 会强制同步布局。长列表用虚拟滚动，别一次插一万个节点。

## 代码 / 例子

```js
const els = document.querySelectorAll('.item');

// 反例：每次写完立刻读，强制同步布局 N 次
els.forEach((el) => {
  el.style.width = el.offsetWidth + 1 + 'px';
});

// 先读完再写
const widths = [];
els.forEach((el) => widths.push(el.offsetWidth));
els.forEach((el, i) => {
  el.style.width = widths[i] + 1 + 'px';
});
```

## 自己的易错点 / 之前答崩过的地方

文件名把 Reflow / Repaint 写反了，我面试时跟着说错过一次。记住：Flow 是布局流，Paint 是画。
我以为改 `visibility` 会重排。它占位还在，只重绘。`display:none` 才重排。
`offsetHeight` 放在循环里当「顺手读一下」，是最容易踩的强制布局。
