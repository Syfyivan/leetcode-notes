# position 各取值的区别

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

| 值 | 是否脱离文档流 | 定位基准 | z-index 是否生效 | 典型用途 |
| --- | --- | --- | --- | --- |
| static（默认） | 否 | — | 否 | — |
| relative | 否（占坑） | **自身原来位置** | 是 | 作为 absolute 基准、微位移 |
| absolute | **是** | 最近的非 static 祖先；没找到就初始包含块 | 是 | 弹窗、浮层、角标 |
| fixed | **是** | 视口（viewport）；受 transform 祖先影响是个坑 | 是 | 吸顶、固定侧边栏 |
| sticky | 否（阈值前占坑） | 最近的滚动祖先 + top/left/right/bottom 阈值 | 是 | 吸顶导航 |

## 常见追问

- Q: 为什么 `position: fixed` 在某些场景下不是相对于视口？（父元素有 transform / perspective / filter 时）
  A:
- Q: 「包含块（containing block）」是什么？absolute 的包含块如何确定？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
