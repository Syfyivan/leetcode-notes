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
      const width = i - stack[stack.length - 1] - 1;
      max = Math.max(max, height * width);
    }
    stack.push(i);
  }
  return max;
}

// —— 自测 ——
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // 10
console.log(largestRectangleArea([2, 4])); // 4

module.exports = { largestRectangleArea };
