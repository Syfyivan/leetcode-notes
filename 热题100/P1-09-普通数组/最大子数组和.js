/**
 * 热题 100 · 最大子数组和
 *
 * 优先级：Hot 100 · P1
 */

/**
 * 最大子数组和（LeetCode 53）
 *
 * 给定一个整数数组 nums，请找出一个具有最大和的连续子数组（子数组最少包含一个元素），
 * 返回其最大和。子数组是数组中的一个连续部分。
 *
 * 思路：
 * 1. Kadane：cur 表示以当前元素结尾的最大和。
 * 2. cur = max(nums[i], cur + nums[i])，负前缀直接丢掉。全局 max 跟着更新。
 * 3. 边界：全是负数时答案是最大的那个负数，不能收成 0。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 * 输出： 6        （连续子数组 [4, -1, 2, 1] 的和最大，为 6）
 *
 * 输入： nums = [1]
 * 输出： 1
 *
 * 输入： nums = [5, 4, -1, 7, 8]
 * 输出： 23
 *
 * ——— 延伸 ———
 * - 返回子数组本身：记下 best 刷新时的起止下标。
 * - 环状最大子数组和：max(普通 Kadane, total - 最小子数组和)。
 * - 最大子矩阵和：压成一维再 Kadane。
 *
 * ——— 常见追问 ———
 * Q: 为什么丢负前缀？
 * A: 负的 cur 加上后面只会拖累。从当前元素重开更好。
 *
 * Q: 全负数怎么办？
 * A: cur 和 best 都从 nums[0] 起。不会收成 0，答案是最大的那个负数。
 *
 * Q: 分治怎么做？
 * A: 跨中点的最大和 = 左后缀 max + 右前缀 max。总复杂度 O(n log n)。
 *
 * Q: 和乘积最大的差别？
 * A: 加法没有负负得正，一个 cur 够。乘积要同时留最小。
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]); // 负前缀丢掉
    best = Math.max(best, cur);
  }
  return best;
}

/**
 * 延伸 1：返回最大和区间
 *
 * 需求：返回 sum、start、end，end 为闭区间下标。
 *
 * 思路：当前累计和小于 0 时，从当前位置重新起段；刷新最大和时记录边界。
 *
 * ——— 示例 ———
 * 示例：[-2,1,-3,4,-1,2,1,-5,4] 返回和 6、区间 [3,6]。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 */
function maxSubArrayRange(nums) {
  if (nums.length === 0) return { sum: 0, start: -1, end: -1 };
  let currentSum = nums[0];
  let currentStart = 0;
  let answer = { sum: nums[0], start: 0, end: 0 };
  for (let i = 1; i < nums.length; i++) {
    if (currentSum < 0) {
      currentSum = nums[i];
      currentStart = i;
    } else currentSum += nums[i];
    if (currentSum > answer.sum) answer = { sum: currentSum, start: currentStart, end: i };
  }
  return answer;
}

// —— 自测 ——
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1]));                             // 1
console.log(maxSubArray([5, 4, -1, 7, 8]));                // 23

module.exports = { maxSubArray, maxSubArrayRange };
