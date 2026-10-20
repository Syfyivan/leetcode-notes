/**
 * 热题 100 · 最长公共子序列
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 最长公共子序列（LeetCode 1143）
 *
 * 给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。如果不存在公共子序列，返回 0。
 * 一个字符串的子序列是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符
 * （也可以不删除任何字符）后组成的新字符串。两个字符串的公共子序列是这两个字符串所共同拥有的子序列。
 *
 * ——— 示例 ———
 * 输入： text1 = "abcde", text2 = "ace"
 * 输出： 3
 *
 * 输入： text1 = "abc", text2 = "abc"
 * 输出： 3
 *
 * 输入： text1 = "abc", text2 = "def"
 * 输出： 0
 *
 * 思路：
 * 1. dp[i][j] 表示 text1 前 i 个与 text2 前 j 个的 LCS 长度。
 * 2. 末尾相同则 dp[i-1][j-1]+1，否则取 max(跳过一侧)。
 * 3. 边界：i=0 或 j=0 时为 0。
 * 复杂度：时间 O(mn)，空间 O(mn)
 */

/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1; // 这对用上，缩成去掉末尾
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // 至少一个用不上
            }
        }
    }
    return dp[m][n];
}

/**
 * 延伸 1：还原一条最长公共子序列
 *
 * 需求：返回实际字符串，不只返回长度。
 *
 * 思路：完整 dp 表从右下回溯；字符相同就收下，否则走 dp 值较大的方向。
 *
 * ——— 示例 ———
 * 示例："abcde" 与 "ace" 输出 "ace"。
 *
 * 复杂度：时间 O(mn)，空间 O(mn)。
 */
function longestCommonSubsequenceString(text1, text2) {
  const dp = Array.from({ length: text1.length + 1 }, () => new Array(text2.length + 1).fill(0));
  for (let i = 1; i <= text1.length; i++) {
    for (let j = 1; j <= text2.length; j++) {
      dp[i][j] = text1[i - 1] === text2[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const chars = [];
  let i = text1.length;
  let j = text2.length;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) { chars.push(text1[i - 1]); i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return chars.reverse().join('');
}

/**
 * ——— 常见追问 ———
 * Q: 子序列和子串差在哪？
 * A: 子序列可删字符、保相对顺序。子串必须连续。
 *
 * Q: 为什么 dp 多一行一列？
 * A: dp[i][j] 对应前 i、前 j 个。第 0 行第 0 列表示空串，LCS 为 0，免去越界。
 *
 * Q: 末尾不等为什么取 max？
 * A: 这个字符至少有一个用不上，要么丢掉 text1 的，要么丢掉 text2 的。
 *
 * Q: 两个空串？
 * A: dp[0][0] = 0，循环不进，返回 0。
 */

// —— 自测 ——
console.log(longestCommonSubsequence("abcde", "ace")); // 3
console.log(longestCommonSubsequence("abc", "abc")); // 3
console.log(longestCommonSubsequence("abc", "def")); // 0

module.exports = { longestCommonSubsequence, longestCommonSubsequenceString };
