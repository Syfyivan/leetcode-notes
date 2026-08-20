/**
 * 数组中的第K个最大元素（LeetCode 215）
 *
 * 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
 * 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
 *
 * ——— 示例 ———
 * 输入： nums = [3,2,1,5,6,4], k = 2
 * 输出： 5
 *
 * 输入： nums = [3,2,3,1,2,4,5,5,6], k = 4
 * 输出： 4
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums, k) {
}

// —— 自测 ——
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4

module.exports = { findKthLargest };
