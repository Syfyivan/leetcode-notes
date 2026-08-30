/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 *
 * 思路：
 * 1. dp[i][j] 为到达 (i,j) 的路径数，只能从上方或左方来。
 * 2. 第一行第一列只有一条路，初始化为 1。
 * 3. 边界：m 或 n 为 1 时答案就是 1。
 * 复杂度：时间 O(mn)，空间 O(mn)
 */
var uniquePaths = function(m, n) {
    const dp = Array.from({length: m}, () => new Array(n).fill(1));

    for(let i = 1; i < m; i++) {
        for(let j = 1; j < n; j++ ) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
};
