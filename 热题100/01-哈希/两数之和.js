/**
 * 两数之和（LeetCode 1）
 *
 * 给定一个整数数组 nums 和一个目标值 target，在数组中找出和为 target 的两个整数，
 * 返回它们的数组下标。假设每种输入只会对应一个答案，同一个元素不能使用两次。
 *
 * ——— 示例 ———
 * 输入： nums = [2, 7, 11, 15],  target = 9
 * 输出： [0, 1]        （nums[0] + nums[1] === 9）
 *
 * 输入： nums = [3, 2, 4],  target = 6
 * 输出： [1, 2]
 *
 * 输入： nums = [3, 3],  target = 6
 * 输出： [0, 1]
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // TODO
}

// —— 自测 ——
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]

module.exports = { twoSum };
