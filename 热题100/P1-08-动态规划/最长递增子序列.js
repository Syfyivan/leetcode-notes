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
 *
 * ——— 延伸 ———
 * - O(n log n)：tails 数组 + 二分，tails[len] = 长度 len+1 的最小尾。
 * - 最长递增子序列的个数（LC 673）：再记 cnt[i]。
 * - 还原序列：记下 pred[i]，从 best 的下标倒推。
 *
 * ——— 常见追问 ———
 * Q: 初值为什么全 1？
 * A: 自己一个数就是长度 1 的递增子序列。
 *
 * Q: 严格递增还是非降？
 * A: 题目严格，用 <。非降改 <=。
 *
 * Q: 为什么答案不是 dp[n-1]？
 * A: LIS 不一定以最后一个数结尾。要全局 max。
 *
 * Q: 能改成子数组吗？
 * A: 连续的话不需要 dp[j]，遇到不增就重开。
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function lengthOfLIS(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1); // 单元素本身就是长度 1
  let best = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]); // LIS 不一定以最后一个数结尾
  }
  return best;
}

// —— 自测 ——
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // 4
console.log(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])); // 1

module.exports = { lengthOfLIS };
