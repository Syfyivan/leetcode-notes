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
 *
 * ——— 延伸 ———
 * - 返回下标不只串：记下 start、minLen 即可。
 * - 包含所有字符的最短超串（不计重复）：need 改成集合。
 * - 替换后的最长重复字符（LC 424）：窗口内最多字符 + k >= 窗长。
 *
 * ——— 常见追问 ———
 * Q: valid 记种类，为什么不记总数？
 * A: 每种字符次数达标才算一类。用总数会把多出来的别的字母算进去，缩窗会错。
 *
 * Q: 为什么 win.get(d) === need.get(d) 才 valid--？
 * A: 从刚好够变成不够。多出来的那些先减不影响覆盖。
 *
 * Q: 窗口里有多余字符怎么办？
 * A: 右扩照进。缩左端时不在 need 里的直接丢掉，不影响 valid。
 *
 * Q: 答案唯一吗？
 * A: 题目保证唯一。多个同长时这段代码留最先出现的（< 才更新）。
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
