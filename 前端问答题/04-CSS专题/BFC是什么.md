# BFC（块级格式化上下文）

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. BFC 的定义（独立渲染区域，内部元素布局不影响外部，反之亦然）
2. 触发 BFC 的条件（至少 5 种，记最常用的：`overflow: hidden/auto/scroll`；`display: flow-root/inline-block/flex/grid`；`position: absolute/fixed`；根元素 `<html>`）
3. BFC 的三大能力 / 能解决的问题：
   - 清除内部浮动（父元素塌陷）
   - 防止兄弟 margin 折叠（塌陷）
   - 阻止文字环绕浮动 / 自适应两栏布局

## 代码 / 例子

```css
/* 父元素塌陷解决方案 3 种写法对比 */
```

## 常见追问

- Q: IFC、GFC、FFC 了解吗？（能答就加分，不会也没关系）
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
