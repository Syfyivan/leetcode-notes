/**
 * 前 K 个高频元素（LeetCode 347）
 *
 * 给你一个整数数组 nums 和一个整数 k，请你返回其中出现频率前 k 高的元素。
 * 你可以按任意顺序返回答案。
 *
 * ——— 示例 ———
 * 输入： nums = [1,1,1,2,2,3], k = 2
 * 输出： [1,2]
 *
 * 输入： nums = [1], k = 1
 * 输出： [1]
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function topKFrequent(nums, k) {
  // TODO
}

// —— 自测 ——
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1,2]
console.log(topKFrequent([1], 1)); // [1]

module.exports = { topKFrequent };
