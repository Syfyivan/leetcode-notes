/**
 * 最长连续序列（LeetCode 128）
 *
 * 给定一个未排序的整数数组 nums，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
 * 请设计并实现时间复杂度为 O(n) 的算法解决此问题。
 *
 * 思路：
 * 1. 全部放进 Set，去重，查询 O(1)。
 * 2. 只从「x-1 不在 Set」的 x 开始往右数，这段才是一段的头。
 * 3. 边界：空数组返回 0。重复数字 Set 会消掉。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： nums = [100, 4, 200, 1, 3, 2]
 * 输出： 4        （最长连续序列是 [1, 2, 3, 4]，长度为 4）
 *
 * 输入： nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
 * 输出： 9
 *
 * 输入： nums = []
 * 输出： 0
 *
 * ——— 延伸 ———
 * - 返回序列本身：起点确定后一边数一边收集。
 * - 差为 d 的等差序列：哈希改查 x - d。
 * - 并查集：相邻数字 union，看最大连通块。排序做法 O(n log n)，面试要 O(n)。
 *
 * ——— 常见追问 ———
 * Q: 为什么只从没有 x-1 的数开始？
 * A: 有 x-1 说明这段更早就开始了。从头数过才会每个数只进一次，总时间才是 O(n)。
 *
 * Q: Set 去重有什么用？
 * A: 重复数字不拉长连续序列。[1,1,2] 长度还是 2。不去重 while 也不会错，白扫。
 *
 * Q: 负数、空数组？
 * A: 负数照样连续。空数组 Set 为空，best 保持 0。
 *
 * Q: 为什么不用排序？
 * A: 能做，但不满足题目 O(n)。哈希 + 只数起点才卡在线性。
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue; // 不是起点，跳过，否则会退化成 O(n^2)
    let y = x;
    let len = 1;
    while (set.has(y + 1)) {
      y++;
      len++;
    }
    best = Math.max(best, len);
  }
  return best;
}

// —— 自测 ——
console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));            // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]));   // 9
console.log(longestConsecutive([]));                               // 0

module.exports = { longestConsecutive };
