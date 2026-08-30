/**
 * 思路：
 * 1. dp[i] = 爬到第 i 阶的方法数，最后一步只能跨 1 阶或 2 阶。
 * 2. dp[i] = dp[i-1] + dp[i-2]。dp[0]=1，dp[1]=1。
 * 3. 边界：n=1 直接返回 1。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    const dp = [];
    dp[0] = 1;
    dp[1] = 1;

    for(let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
};
