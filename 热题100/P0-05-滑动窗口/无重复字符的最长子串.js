/**
 * 无重复字符的最长子串（LeetCode 3）
 *
 * 给定一个字符串 s，请找出其中不含有重复字符的最长子串的长度。
 * 子串是字符串中连续的字符序列。
 *
 * 思路：
 * 1. 窗口 [left, i] 里字符不重复，用 map 记下每个字符最近一次出现的位置。
 * 2. 当前字符上次出现在窗口内，就把 left 收到 last+1。
 * 3. 边界：空串返回 0。全相同字符答案是 1。
 * 复杂度：时间 O(n)，空间 O(字符集)
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
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (last.has(s[i]) && last.get(s[i]) >= left) {
      left = last.get(s[i]) + 1; // 只往右收，别把 left 拉回去
    }
    last.set(s[i], i);
    best = Math.max(best, i - left + 1);
  }
  return best;
}

// —— 自测 ——
console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb"));    // 1
console.log(lengthOfLongestSubstring("pwwkew"));   // 3

module.exports = { lengthOfLongestSubstring };
