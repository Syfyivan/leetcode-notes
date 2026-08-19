/**
 * 最小覆盖子串（LeetCode 76）
 *
 * 给定一个字符串 s 和一个字符串 t，返回 s 中涵盖 t 所有字符（含重复次数）的最小子串。
 * 如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 ""。
 * 如果存在这样的子串，题目保证它是唯一的答案。s 和 t 由英文字母组成。
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
  // TODO
}

// —— 自测 ——
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a"));               // "a"
console.log(minWindow("a", "aa"));              // ""

module.exports = { minWindow };
