/**
 * 热题 100 · 接雨水
 *
 * 优先级：Hot 100 · P0
 */

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

/**
 * 延伸 1：前后缀最大值
 *
 * 需求：为每个位置预先算好左右最高墙，再逐格累加水量。
 *
 * 思路：leftMax 从左扫，rightMax 从右扫；当前位置水量为两者较小值减柱高。
 *
 * ——— 示例 ———
 * 示例：[4,2,0,3,2,5] 输出 9。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function trapWithPrefix(height) {
  const n = height.length;
  if (n < 3) return 0;
  const leftMax = new Array(n);
  const rightMax = new Array(n);
  leftMax[0] = height[0];
  rightMax[n - 1] = height[n - 1];
  for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  let water = 0;
  for (let i = 1; i < n - 1; i++) water += Math.min(leftMax[i], rightMax[i]) - height[i];
  return water;
}

/**
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

// —— 自测 ——
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trap([4, 2, 0, 3, 2, 5]));                   // 9

module.exports = { trap, trapWithPrefix };
