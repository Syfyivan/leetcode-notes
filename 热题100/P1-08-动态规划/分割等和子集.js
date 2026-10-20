/**
 * 热题 100 · 分割等和子集
 *
 * 优先级：Hot 100 · P1
 */

// 给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。


// 输入：nums = [1,5,11,5]
// 输出：true
// 解释：数组可以分割成 [1, 5, 5] 和 [11] 。
// 1 1 2 2
/**
 * 思路：
 * 1. 总和为奇数直接 false。目标是挑一堆数凑出 sum/2。
 * 2. 0-1 背包：dp[j] 表示能否凑出 j。每个数用一次。
 * 3. 边界：一维数组时容量必须从大到小倒着推，否则一个数会被用多次。
 * 复杂度：时间 O(n * sum/2)，空间 O(sum/2)

 *
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
    const sum = nums.reduce((a, b) => a + b, 0 );
    if(sum % 2 != 0) return false;

    const target = sum / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true; // 凑 0 不拿任何数；num 自身等于 target 也靠它

    for (const num of nums) {
        for (let j = target; j >= num; j--) { // 倒序，防止一个数用两次
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
};

/**
 * 延伸 1：返回一个目标子集
 *
 * 需求：可分割时返回和为总和一半的元素集合；不可分割返回 null。
 *
 * 思路：0/1 背包倒序更新，dp[sum] 直接保存第一次构成该和的数组。
 *
 * ——— 示例 ———
 * 示例：[1,5,11,5] 可返回 [11] 或 [1,5,5]。
 *
 * 复杂度：状态转移 O(n*target)，为还原路径额外复制数组。
 */
function partitionSubset(nums) {
  const total = nums.reduce((sum, value) => sum + value, 0);
  if (total % 2) return null;
  const target = total / 2;
  const dp = new Array(target + 1).fill(null);
  dp[0] = [];
  for (const value of nums) {
    for (let sum = target; sum >= value; sum--) {
      if (dp[sum] === null && dp[sum - value] !== null) {
        dp[sum] = dp[sum - value].concat(value);
      }
    }
  }
  return dp[target];
}

/**
 * ——— 常见追问 ———
 * Q: 为什么倒序？
 * A: 一维滚动。正序的话 dp[j - num] 已经用过当前 num，等于一个数用两次。
 *
 * Q: 总和奇数直接 false？
 * A: 两堆相等，总和必须偶数。省掉后面的背包。
 *
 * Q: dp[0] = true？
 * A: 凑 0 什么都不拿就行。某个 num 自己等于 target 时也靠它。
 *
 * Q: 和零钱兑换差在哪？
 * A: 零钱可重复用（完全背包），本题每个数只用一次（0-1）。循环顺序相反。
 */

// —— 自测 ——
console.log(canPartition([1, 5, 11, 5])); // true

module.exports = { canPartition, partitionSubset };
