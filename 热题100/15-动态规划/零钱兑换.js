/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = [];
    dp[0] = 0;

    for(let i = 0; i <=  amount; i++) {
        dp[i] = Infinity;
        for(let j = 0; j < coins.length; j++) {
            if(i - coins[j] > 0) {
                dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);  
            }
            
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];

};