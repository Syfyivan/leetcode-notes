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
 */

/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
function longestCommonSubsequence(text1, text2) {
}

// —— 自测 ——
console.log(longestCommonSubsequence("abcde", "ace")); // 3
console.log(longestCommonSubsequence("abc", "abc")); // 3
console.log(longestCommonSubsequence("abc", "def")); // 0

module.exports = { longestCommonSubsequence };
