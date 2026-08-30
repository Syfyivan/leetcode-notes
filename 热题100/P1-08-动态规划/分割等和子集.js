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
    dp[0] = true;

    for (const num of nums) {
        for (let j = target; j >= num; j--) { // 倒序，防止一个数用两次
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
};
