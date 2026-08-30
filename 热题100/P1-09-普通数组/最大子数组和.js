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

// —— 自测 ——
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1]));                             // 1
console.log(maxSubArray([5, 4, -1, 7, 8]));                // 23

module.exports = { maxSubArray };
