/**
 * 思路：
 * 1. dp[i] = 凑出金额 i 的最少硬币数。
 * 2. 枚举硬币 c，若 i >= c，dp[i] = min(dp[i], dp[i-c] + 1)。硬币可重复用，完全背包。
 * 3. 边界：dp[0]=0，其余先填 Infinity。凑不出返回 -1。
 * 复杂度：时间 O(amount * |coins|)，空间 O(amount)
 *
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for(let i = 1; i <= amount; i++) {
        for(let j = 0; j < coins.length; j++) {
            if(i - coins[j] >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
};
