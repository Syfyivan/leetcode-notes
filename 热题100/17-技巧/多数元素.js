/**
 * 多数元素（LeetCode 169）
 *
 * 给定一个大小为 n 的数组 nums，返回其中的多数元素。多数元素是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。
 * 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
 *
 * ——— 示例 ———
 * 输入： nums = [3,2,3]
 * 输出： 3
 *
 * 输入： nums = [2,2,1,1,1,2,2]
 * 输出： 2
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function majorityElement(nums) {
  // TODO
}

// —— 自测 ——
console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2

module.exports = { majorityElement };
