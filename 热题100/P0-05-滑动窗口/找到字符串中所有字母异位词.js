/**
 * 找到字符串中所有字母异位词（LeetCode 438）
 *
 * 给定两个字符串 s 和 p，找到 s 中所有 p 的字母异位词的子串，返回这些子串的起始索引。
 * 不考虑答案输出的顺序。s 和 p 仅包含小写字母。
 * 字母异位词是指由相同字母（含出现次数）以不同顺序排列组成的字符串。
 *
 * 思路：
 * 1. 统计 p 的 26 字母计数。窗口长度固定为 p.length。
 * 2. 右端进一个字符、左端出一个，窗口计数和 p 相同就把左端下标记下。
 * 3. 边界：s 比 p 短，直接返回空数组。
 * 复杂度：时间 O(|s|)，空间 O(1)
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
  if (s.length < p.length) return [];
  const need = new Array(26).fill(0);
  const win = new Array(26).fill(0);
  const a = 'a'.charCodeAt(0);
  for (const ch of p) need[ch.charCodeAt(0) - a]++;

  const same = () => {
    for (let i = 0; i < 26; i++) if (need[i] !== win[i]) return false;
    return true;
  };

  const res = [];
  for (let i = 0; i < s.length; i++) {
    win[s.charCodeAt(i) - a]++;
    if (i >= p.length) win[s.charCodeAt(i - p.length) - a]--; // 窗口超长，弹出左端
    if (i >= p.length - 1 && same()) res.push(i - p.length + 1);
  }
  return res;
}

// —— 自测 ——
console.log(findAnagrams("cbaebabacd", "abc")); // [0, 6]
console.log(findAnagrams("abab", "ab"));        // [0, 1, 2]

module.exports = { findAnagrams };
