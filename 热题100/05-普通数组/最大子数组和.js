/**
 * 最大子数组和（LeetCode 53）
 *
 * 给定一个整数数组 nums，请找出一个具有最大和的连续子数组（子数组最少包含一个元素），
 * 返回其最大和。子数组是数组中的一个连续部分。
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
}

// —— 自测 ——
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1]));                             // 1
console.log(maxSubArray([5, 4, -1, 7, 8]));                // 23

module.exports = { maxSubArray };
