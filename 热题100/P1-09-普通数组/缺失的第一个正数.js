/**
 * 缺失的第一个正数（LeetCode 41）
 *
 * 给定一个未排序的整数数组 nums，请找出其中没有出现的最小的正整数。
 * 请实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
 *
 * ——— 示例 ———
 * 输入： nums = [1, 2, 0]
 * 输出： 3        （范围 [1, 2] 都出现了，缺失的最小正数是 3）
 *
 * 输入： nums = [3, 4, -1, 1]
 * 输出： 2        （1 在数组中，2 没有出现）
 *
 * 输入： nums = [7, 8, 9, 11, 12]
 * 输出： 1        （最小的正数 1 没有出现）
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function firstMissingPositive(nums) {
}

// —— 自测 ——
console.log(firstMissingPositive([1, 2, 0]));           // 3
console.log(firstMissingPositive([3, 4, -1, 1]));       // 2
console.log(firstMissingPositive([7, 8, 9, 11, 12]));   // 1

module.exports = { firstMissingPositive };
