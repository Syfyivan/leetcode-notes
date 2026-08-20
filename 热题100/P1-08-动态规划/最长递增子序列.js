/**
 * 最长递增子序列（LeetCode 300）
 *
 * 给你一个整数数组 nums，找到其中最长严格递增子序列的长度。
 * 子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。
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
}

// —— 自测 ——
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // 4
console.log(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])); // 1

module.exports = { lengthOfLIS };
