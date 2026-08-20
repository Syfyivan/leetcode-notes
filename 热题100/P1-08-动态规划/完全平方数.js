/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    const dp = [];

    dp[0] = 0;
    dp[1] = 1;
    for(let i = 2; i <= n; i++) {
        for(let j = 1; j * j <= i; j++) {
            dp[i] = Math.max(dp[i - j * j] + 1, i);
        }
    } 
    return dp[n]
};