/**
 * 编辑距离（LeetCode 72）
 *
 * 给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的最少操作数。
 * 你可以对一个单词进行如下三种操作：插入一个字符、删除一个字符、替换一个字符。
 *
 * ——— 示例 ———
 * 输入： word1 = "horse", word2 = "ros"
 * 输出： 3
 *
 * 输入： word1 = "intention", word2 = "execution"
 * 输出： 5
 *
 * 思路：
 * 1. dp[i][j] 表示 word1 前 i 个变成 word2 前 j 个的最少操作。
 * 2. 末尾相同沿用 dp[i-1][j-1]；否则 min(插、删、替)+1。
 * 3. 边界：空串变成另一串的代价是长度本身。
 * 复杂度：时间 O(mn)，空间 O(mn)
 */

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i; // 删掉 word1 前 i 个
    for (let j = 0; j <= n; j++) dp[0][j] = j; // 插入 word2 前 j 个
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i][j - 1],     // 插入
                    dp[i - 1][j],     // 删除
                    dp[i - 1][j - 1]  // 替换
                ) + 1;
            }
        }
    }
    return dp[m][n];
}

// —— 自测 ——
console.log(minDistance("horse", "ros")); // 3
console.log(minDistance("intention", "execution")); // 5

module.exports = { minDistance };
