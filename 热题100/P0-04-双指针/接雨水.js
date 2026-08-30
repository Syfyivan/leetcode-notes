/**
 * 接雨水（LeetCode 42）
 *
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图（数组 height），
 * 计算按此排列的柱子下雨之后能接多少雨水。
 *
 * 思路：
 * 1. 位置 i 能接的水 = min(左边最高, 右边最高) - height[i]，小于 0 当 0。
 * 2. 左右夹逼：height[L] < height[R] 时，左边最高已经确定，结算 L；反之结算 R。
 * 3. 边界：柱子少于 3 根接不到水。
 * 复杂度：时间 O(n)，空间 O(1)
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
  let L = 0;
  let R = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (L < R) {
    // 矮的一侧才能结算：这一侧的 min(leftMax, rightMax) 就是自己这边的 max
    if (height[L] < height[R]) {
      if (height[L] >= leftMax) leftMax = height[L];
      else water += leftMax - height[L];
      L++;
    } else {
      if (height[R] >= rightMax) rightMax = height[R];
      else water += rightMax - height[R];
      R--;
    }
  }
  return water;
}

// —— 自测 ——
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trap([4, 2, 0, 3, 2, 5]));                   // 9

module.exports = { trap };
