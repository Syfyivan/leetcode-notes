/**
 * 柱状图中最大的矩形（LeetCode 84）
 *
 * 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1。
 * 求在该柱状图中，能够勾勒出来的矩形的最大面积。
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
  // TODO
}

// —— 自测 ——
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // 10
console.log(largestRectangleArea([2, 4])); // 4

module.exports = { largestRectangleArea };
