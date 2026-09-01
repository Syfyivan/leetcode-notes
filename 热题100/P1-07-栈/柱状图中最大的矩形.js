/**
 * 热题 100 · 柱状图中最大的矩形
 *
 * 优先级：Hot 100 · P1
 */

/**
 * 柱状图中最大的矩形（LeetCode 84）
 *
 * 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1。
 * 求在该柱状图中，能够勾勒出来的矩形的最大面积。
 *
 * 思路：
 * 1. 对每根柱找左边第一个更矮、右边第一个更矮，宽就是这段，面积 = 高 * 宽。
 * 2. 单调递增栈存下标。扫到更矮的柱，栈顶右边就是 i，左边是新栈顶。
 * 3. 边界：heights 前后各补一根高度 0 的哨兵，扫完栈会被清空。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： heights = [2,1,5,6,2,3]
 * 输出： 10
 *
 * 输入： heights = [2,4]
 * 输出： 4
 *
 * ——— 延伸 ———
 * - 最大矩形（LC 85）：每一层当柱状图的 heights，套本题。
 * - 不补哨兵：扫完再把栈里剩的当右边界 = n 结算。
 * - 接雨水单调栈：同样找左右更矮，算的是积水。
 *
 * ——— 常见追问 ———
 * Q: 为什么要单调递增栈？
 * A: 栈顶右边第一个更矮的就是当前 i。左边界是弹完后的新栈顶。两边都是「第一个更矮」。
 *
 * Q: 哨兵 0 干什么？
 * A: 开头 0 当左墙，结尾 0 把还在栈里的柱子全弹出来结算。少写扫尾代码。
 *
 * Q: 宽度为什么是 i - stack[top] - 1？
 * A: i 是右边第一个更矮，新栈顶是左边第一个更矮，中间才是能用的宽。
 *
 * Q: 高度相同怎么处理？
 * A: h[i] < 栈顶才弹。相等会压进去，后面的同高柱会把前面的弹掉，面积一样。
 */

/**
 * @param {number[]} heights
 * @return {number}
 */
function largestRectangleArea(heights) {
  const h = [0, ...heights, 0]; // 哨兵 0，把栈清空
  const stack = [];
  let max = 0;
  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[i] < h[stack[stack.length - 1]]) {
      const height = h[stack.pop()];
      const width = i - stack[stack.length - 1] - 1; // 左右都是第一个更矮，中间才是宽
      max = Math.max(max, height * width);
    }
    stack.push(i);
  }
  return max;
}

/**
 * 延伸 1：二维最大矩形（LeetCode 85）
 *
 * 需求：0/1 矩阵中求全为 1 的最大矩形面积。
 *
 * 思路：逐行累计每列连续 1 的高度，每一行都转化为一次柱状图最大矩形。
 *
 * ——— 示例 ———
 * 示例：[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1]] 输出 6。
 *
 * 复杂度：时间 O(rows*cols)，空间 O(cols)。
 */
function maximalRectangle(matrix) {
  if (matrix.length === 0) return 0;
  const heights = new Array(matrix[0].length).fill(0);
  let best = 0;
  for (const row of matrix) {
    for (let col = 0; col < row.length; col++) {
      heights[col] = String(row[col]) === '1' ? heights[col] + 1 : 0;
    }
    best = Math.max(best, largestRectangleArea(heights));
  }
  return best;
}

// —— 自测 ——
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // 10
console.log(largestRectangleArea([2, 4])); // 4

module.exports = { largestRectangleArea, maximalRectangle };
