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
 *
 * ——— 延伸 ———
 * - 单调栈：扫到更高柱，弹出栈顶，左右墙夹出积水。
 * - 前后缀 max：leftMax / rightMax 各扫一遍，空间 O(n)，好写。
 * - 接雨水 II（二维）：最小堆 + BFS，从边界往里灌。
 *
 * ——— 常见追问 ———
 * Q: 为什么矮的一侧才能结算？
 * A: 水取决于 min(左最高, 右最高)。矮侧的 max 已经是瓶颈，对面至少跟它一样高。
 *
 * Q: L 和 R 碰上那一格算不算？
 * A: 算不到。中间那根是山峰，上面存不住水。
 *
 * Q: 和盛水容器差在哪？
 * A: 盛水选两根当壁，中间忽略。接雨水每一格都要算头顶能灌多少。
 *
 * Q: 柱子少于 3 根？
 * A: 接不到水。L < R 自然结束，water 保持 0。
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
