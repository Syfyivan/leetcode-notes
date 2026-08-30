/**
 * 盛最多水的容器（LeetCode 11）
 *
 * 给定一个长度为 n 的整数数组 height，有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。
 * 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水，返回容器可以储存的最大水量。
 * 注意：容器不能倾斜。
 *
 * 思路：
 * 1. 左右两端夹逼，面积 = min(h[L], h[R]) * (R - L)。
 * 2. 每次把较矮的那一侧往里收一步，宽变小，高度才可能变大。
 * 3. 边界：只剩两条线时算完就停。
 * 复杂度：时间 O(n)，空间 O(1)
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
  let L = 0;
  let R = height.length - 1;
  let best = 0;
  while (L < R) {
    const h = Math.min(height[L], height[R]);
    best = Math.max(best, h * (R - L));
    if (height[L] < height[R]) L++;
    else R--;
  }
  return best;
}

// —— 自测 ——
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                      // 1

module.exports = { maxArea };
