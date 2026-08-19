/**
 * 找到字符串中所有字母异位词（LeetCode 438）
 *
 * 给定两个字符串 s 和 p，找到 s 中所有 p 的字母异位词的子串，返回这些子串的起始索引。
 * 不考虑答案输出的顺序。s 和 p 仅包含小写字母。
 * 字母异位词是指由相同字母（含出现次数）以不同顺序排列组成的字符串。
 *
 * ——— 示例 ———
 * 输入： s = "cbaebabacd",  p = "abc"
 * 输出： [0, 6]
 *          起始索引 0 的子串是 "cba"，是 "abc" 的字母异位词；
 *          起始索引 6 的子串是 "bac"，是 "abc" 的字母异位词。
 *
 * 输入： s = "abab",  p = "ab"
 * 输出： [0, 1, 2]
 */

/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
function findAnagrams(s, p) {
  // TODO
}

// —— 自测 ——
console.log(findAnagrams("cbaebabacd", "abc")); // [0, 6]
console.log(findAnagrams("abab", "ab"));        // [0, 1, 2]

module.exports = { findAnagrams };
