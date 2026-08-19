/**
 * 只出现一次的数字（LeetCode 136）
 *
 * 给你一个非空整数数组 nums，除了某个元素只出现一次以外，其余每个元素均出现两次。
 * 找出那个只出现了一次的元素。
 * 你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
 *
 * ——— 示例 ———
 * 输入： nums = [2,2,1]
 * 输出： 1
 *
 * 输入： nums = [4,1,2,1,2]
 * 输出： 4
 *
 * 输入： nums = [1]
 * 输出： 1
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
  // TODO
}

// —— 自测 ——
console.log(singleNumber([2, 2, 1])); // 1
console.log(singleNumber([4, 1, 2, 1, 2])); // 4
console.log(singleNumber([1])); // 1

module.exports = { singleNumber };
