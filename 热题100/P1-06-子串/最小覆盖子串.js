/**
 * 最小覆盖子串（LeetCode 76）
 *
 * 给定一个字符串 s 和一个字符串 t，返回 s 中涵盖 t 所有字符（含重复次数）的最小子串。
 * 如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 ""。
 * 如果存在这样的子串，题目保证它是唯一的答案。s 和 t 由英文字母组成。
 *
 * 思路：
 * 1. need 记 t 每个字符要几次，valid 记已经凑齐的字符种类。
 * 2. 右指针扩窗，某字符次数刚好达标 valid++。valid 满了就缩左端，顺便更新最短串。
 * 3. 边界：t 比 s 长返回 ""。只在窗口已经覆盖 t 时才缩。
 * 复杂度：时间 O(|s| + |t|)，空间 O(字符集)
 *
 * ——— 示例 ———
 * 输入： s = "ADOBECODEBANC",  t = "ABC"
 * 输出： "BANC"
 *
 * 输入： s = "a",  t = "a"
 * 输出： "a"
 *
 * 输入： s = "a",  t = "aa"
 * 输出： ""       （t 中有两个 'a'，s 无法涵盖，故没有符合条件的子串）
 */

/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
function minWindow(s, t) {
  if (s.length < t.length) return '';
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  const needKinds = need.size;
  const win = new Map();
  let valid = 0;
  let left = 0;
  let start = 0;
  let minLen = Infinity;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      win.set(c, (win.get(c) || 0) + 1);
      if (win.get(c) === need.get(c)) valid++;
    }
    while (valid === needKinds) { // 覆盖齐全才缩左端
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const d = s[left];
      left++;
      if (need.has(d)) {
        if (win.get(d) === need.get(d)) valid--; // 次数一旦不够，窗口不再覆盖
        win.set(d, win.get(d) - 1);
      }
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
}

// —— 自测 ——
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a"));               // "a"
console.log(minWindow("a", "aa"));              // ""

module.exports = { minWindow };
