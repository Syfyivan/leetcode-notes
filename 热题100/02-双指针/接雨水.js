/**
 * 接雨水（LeetCode 42）
 *
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图（数组 height），
 * 计算按此排列的柱子下雨之后能接多少雨水。
 *
 * ——— 示例 ———
 * 输入： height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
 * 输出： 6
 *
 * 输入： height = [4, 2, 0, 3, 2, 5]
 * 输出： 9
 */

/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // TODO
}

// —— 自测 ——
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trap([4, 2, 0, 3, 2, 5]));                   // 9

module.exports = { trap };
