/**
 * 无重复字符的最长子串（LeetCode 3）
 *
 * 给定一个字符串 s，请找出其中不含有重复字符的最长子串的长度。
 * 子串是字符串中连续的字符序列。
 *
 * ——— 示例 ———
 * 输入： s = "abcabcbb"
 * 输出： 3        （最长子串是 "abc"）
 *
 * 输入： s = "bbbbb"
 * 输出： 1        （最长子串是 "b"）
 *
 * 输入： s = "pwwkew"
 * 输出： 3        （最长子串是 "wke"）
 */

/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // TODO
}

// —— 自测 ——
console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb"));    // 1
console.log(lengthOfLongestSubstring("pwwkew"));   // 3

module.exports = { lengthOfLongestSubstring };
