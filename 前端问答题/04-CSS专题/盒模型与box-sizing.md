# 盒模型与 box-sizing

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

1. 两种盒模型：
   - **content-box（W3C 标准盒模型）**：宽高 = content，padding / border 往外撑
   - **border-box（IE 盒模型 / 怪异模式）**：宽高 = content + padding + border，整体尺寸可控
2. box-sizing 三个取值：content-box / border-box / padding-box（已废弃）
3. 为什么大家都在全局设 `* { box-sizing: border-box }`？写布局时到底好在哪？
4. `box-sizing: border-box` 下，设置了 `width: 100px` 再设置 `padding: 20px`，最终 content 区有多宽？

## 常见追问

- Q: 外边距折叠（margin collapse）的三种场景 + 解决思路？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
