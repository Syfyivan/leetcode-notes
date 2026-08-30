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
 *
 * ——— 延伸 ———
 * - 用 diff 计数代替 26 次比较：窗口恰好匹配时 diff=0，进/出各改一次。
 * - 字符串排列（LC 567）：只问存不存在，找到一个就 true。
 * - 最小覆盖子串：窗口长度不固定，覆盖后缩左端。
 *
 * ——— 常见追问 ———
 * Q: 窗口为什么固定长度？
 * A: 异位词长度必须等于 p。固定滑，每次进一个出一个。
 *
 * Q: 为什么 i >= p.length 才弹出？
 * A: 前 p.length 个是第一扇窗。再往右才需要把左端挤出去。
 *
 * Q: same() 每次扫 26 会不会慢？
 * A: 常数。|s| 到 1e4 完全够。要更快就维护「还差几种」。
 *
 * Q: 和分组异位词的区别？
 * A: 那题按 key 归堆。这题在长串里找短串的排列，滑窗计数。
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
    if (i >= p.length) win[s.charCodeAt(i - p.length) - a]--; // 固定窗长，右进一个必须左出一个
    if (i >= p.length - 1 && same()) res.push(i - p.length + 1); // 窗长凑齐才可能是异位词
  }
  return res;
}

// —— 自测 ——
console.log(findAnagrams("cbaebabacd", "abc")); // [0, 6]
console.log(findAnagrams("abab", "ab"));        // [0, 1, 2]

module.exports = { findAnagrams };
