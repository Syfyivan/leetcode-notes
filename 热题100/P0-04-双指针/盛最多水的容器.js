/**
 * 热题 100 · 盛最多水的容器
 *
 * 优先级：Hot 100 · P0
 */

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
 *
 * ——— 延伸 ———
 * - 接雨水：每格单独算灌水量，不能直接套这题的夹逼。
 * - 返回下标不只面积：记下 best 时的 L、R。
 * - 高度可更新：线段树维护区间最大高度。
 *
 * ——— 常见追问 ———
 * Q: 为什么移动较矮的那边？
 * A: 面积被矮边卡住。动高边宽变小、高不变，面积只会更差。动矮边才可能换到更高。
 *
 * Q: 两边一样高呢？
 * A: 随便动哪边。代码走 else R--。同时动两边会漏掉最优。
 *
 * Q: 能不能二分？
 * A: 高度没有单调性，二分找不到该动哪边。夹逼是因为丢弃的那边不可能更好。
 *
 * Q: 和接雨水的双指针一样吗？
 * A: 都是两端往里。这题比面积，接雨水比每格能灌多少，更新条件不同。
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
    if (height[L] < height[R]) L++; // 面积被矮边卡住，动它才可能更高
    else R--;
  }
  return best;
}

/**
 * 延伸 1：同时返回最佳边界
 *
 * 需求：除最大面积外，还返回组成容器的两个下标。
 *
 * 思路：双指针规则不变；刷新 best 时同步保存 left/right。
 *
 * ——— 示例 ———
 * 示例：[1,8,6,2,5,4,8,3,7] 返回 {area:49,left:1,right:8}。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 */
function maxAreaWithIndices(height) {
  let left = 0;
  let right = height.length - 1;
  let answer = { area: 0, left: -1, right: -1 };
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    if (area > answer.area) answer = { area, left, right };
    if (height[left] <= height[right]) left++;
    else right--;
  }
  return answer;
}

// —— 自测 ——
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                      // 1

module.exports = { maxArea, maxAreaWithIndices };
