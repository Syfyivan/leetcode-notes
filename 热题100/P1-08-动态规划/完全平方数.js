/**
 * 思路：
 * 1. 和零钱兑换同构，物品换成 1、4、9... 这些完全平方数，可重复用。
 * 2. dp[i] = 凑出 i 的最少个数，dp[i] = min(dp[i - j*j] + 1)。
 * 3. 边界：dp[0]=0。n=1 返回 1。
 * 复杂度：时间 O(n * sqrt(n))，空间 O(n)
 *
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
        }
    }
    return dp[n];
};
