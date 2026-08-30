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
 * ——— 延伸 ———
 * - 完全背包（零钱）：每个数可用多次，容量从小到大。
 * - 目标和（LC 494）：部分取正部分取负，转化成 0-1 背包。
 * - 分成 k 个等和子集：状态压缩或回溯剪枝，难一档。
 *
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
