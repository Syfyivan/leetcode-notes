/**
 * 下一个排列（LeetCode 31）
 *
 * 整数数组的一个排列就是将其所有成员以序列或线性顺序排列。
 * 整数数组的下一个排列是指其整数的下一个字典序更大的排列。如果不存在下一个更大的排列，
 * 则将数组重新排列成字典序最小的排列（即升序排列）。
 * 必须原地修改，只允许使用额外常数空间。
 *
 * ——— 示例 ———
 * 输入： nums = [1,2,3]
 * 输出： [1,3,2]
 *
 * 输入： nums = [3,2,1]
 * 输出： [1,2,3]
 *
 * 输入： nums = [1,1,5]
 * 输出： [1,5,1]
 */

/**
 * @param {number[]} nums
 * @return {number[]} 原地修改后返回 nums 便于打印
 */
function nextPermutation(nums) {
  // TODO
}

// —— 自测 ——
console.log(nextPermutation([1, 2, 3])); // [1,3,2]
console.log(nextPermutation([3, 2, 1])); // [1,2,3]
console.log(nextPermutation([1, 1, 5])); // [1,5,1]

module.exports = { nextPermutation };
