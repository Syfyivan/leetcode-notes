/**
 * 和为 K 的子数组（LeetCode 560）
 *
 * 给定一个整数数组 nums 和一个整数 k，请统计并返回该数组中和为 k 的连续子数组的个数。
 * 子数组是数组中元素的连续非空序列。
 *
 * 思路：
 * 1. 前缀和 pre。nums[j+1..i] 的和等于 pre[i] - pre[j]。
 * 2. 要这段和为 k，就是看之前有多少个前缀等于 pre - k。HashMap 记每个前缀出现次数。
 * 3. 边界：一开始 map 里放 {0:1}，对应空前缀，这样从下标 0 起的子数组也能算到。
 * 复杂度：时间 O(n)，空间 O(n)
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
  const map = new Map([[0, 1]]); // 空前缀和为 0，出现 1 次
  let pre = 0;
  let count = 0;
  for (const x of nums) {
    pre += x;
    count += map.get(pre - k) || 0; // 先查再写入，避免当前前缀自己配自己
    map.set(pre, (map.get(pre) || 0) + 1);
  }
  return count;
}

// —— 自测 ——
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, 2, 3], 3)); // 2

module.exports = { subarraySum };
