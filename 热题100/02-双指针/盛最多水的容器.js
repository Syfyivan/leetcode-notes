/**
 * 盛最多水的容器（LeetCode 11）
 *
 * 给定一个长度为 n 的整数数组 height，有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。
 * 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水，返回容器可以储存的最大水量。
 * 注意：容器不能倾斜。
 *
 * ——— 示例 ———
 * 输入： height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
 * 输出： 49
 *
 * 输入： height = [1, 1]
 * 输出： 1
 */

/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // TODO
}

// —— 自测 ——
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                      // 1

module.exports = { maxArea };
