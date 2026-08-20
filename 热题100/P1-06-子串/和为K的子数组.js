/**
 * 和为 K 的子数组（LeetCode 560）
 *
 * 给定一个整数数组 nums 和一个整数 k，请统计并返回该数组中和为 k 的连续子数组的个数。
 * 子数组是数组中元素的连续非空序列。
 *
 * ——— 示例 ———
 * 输入： nums = [1, 1, 1],  k = 2
 * 输出： 2
 *
 * 输入： nums = [1, 2, 3],  k = 3
 * 输出： 2
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function subarraySum(nums, k) {
}

// —— 自测 ——
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, 2, 3], 3)); // 2

module.exports = { subarraySum };
