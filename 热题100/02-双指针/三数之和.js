/**
 * 三数之和（LeetCode 15）
 *
 * 给定一个整数数组 nums，返回所有满足 i != j、i != k、j != k，
 * 且 nums[i] + nums[j] + nums[k] === 0 的三元组。
 * 答案中不可包含重复的三元组，三元组的顺序和三元组内元素的顺序均不作要求。
 *
 * ——— 示例 ———
 * 输入： nums = [-1, 0, 1, 2, -1, -4]
 * 输出： [[-1, -1, 2], [-1, 0, 1]]
 *
 * 输入： nums = [0, 1, 1]
 * 输出： []
 *
 * 输入： nums = [0, 0, 0]
 * 输出： [[0, 0, 0]]
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
}

// —— 自测 ——
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1, -1, 2], [-1, 0, 1]]
console.log(threeSum([0, 1, 1]));             // []
console.log(threeSum([0, 0, 0]));             // [[0, 0, 0]]

module.exports = { threeSum };
