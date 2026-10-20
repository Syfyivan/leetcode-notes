/**
 * 热题 100 · 和为K的子数组
 *
 * 优先级：Hot 100 · P1
 */

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

/**
 * 延伸 1：最长和为 k 的子数组
 *
 * 需求：返回满足和为 k 的最长连续子数组长度，数组可含负数。
 *
 * 思路：Map 只保存某个前缀和第一次出现的位置；当前 prefix-k 出现过即可形成区间。
 *
 * ——— 示例 ———
 * 示例：[1,-1,5,-2,3]，k=3，输出 4。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function maxSubArrayLen(nums, k) {
  const firstIndex = new Map([[0, -1]]);
  let prefix = 0;
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    prefix += nums[i];
    if (firstIndex.has(prefix - k)) best = Math.max(best, i - firstIndex.get(prefix - k));
    if (!firstIndex.has(prefix)) firstIndex.set(prefix, i);
  }
  return best;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么先查再写入？
 * A: 子数组非空。先写再查，k = 0 时当前前缀会配到自己，空段被算进去。
 *
 * Q: map 初始 {0: 1}？
 * A: 对应空前缀。从下标 0 开始的子数组，pre 本身就等于 k，要靠这个 0。
 *
 * Q: 有负数怎么办？
 * A: 前缀和照样用。不能滑窗，加上负数窗口和会变小，没单调性。
 *
 * Q: 和最小覆盖 / 滑窗差在哪？
 * A: 那两题窗口有「越大越满足」的单调。本题有负数，只能前缀哈希。
 */

// —— 自测 ——
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, 2, 3], 3)); // 2

module.exports = { subarraySum, maxSubArrayLen };
