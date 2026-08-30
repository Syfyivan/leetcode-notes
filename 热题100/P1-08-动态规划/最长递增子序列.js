/**
 * 最长递增子序列（LeetCode 300）
 *
 * 给你一个整数数组 nums，找到其中最长严格递增子序列的长度。
 * 子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。
 *
 * 思路：
 * 1. dp[i] = 以 nums[i] 结尾的最长递增子序列长度，初值全是 1。
 * 2. 枚举 j < i，nums[j] < nums[i] 时 dp[i] = max(dp[i], dp[j]+1)。
 * 3. 边界：全相等时答案是 1。
 * 复杂度：时间 O(n^2)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： nums = [10,9,2,5,3,7,101,18]
 * 输出： 4
 *
 * 输入： nums = [0,1,0,3,2,3]
 * 输出： 4
 *
 * 输入： nums = [7,7,7,7,7,7,7]
 * 输出： 1
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function lengthOfLIS(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  let best = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}

// —— 自测 ——
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // 4
console.log(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])); // 1

module.exports = { lengthOfLIS };
