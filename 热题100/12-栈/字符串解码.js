/**
 * 字符串解码（LeetCode 394）
 *
 * 给定一个经过编码的字符串，返回它解码后的字符串。
 * 编码规则为 k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
 * 输入字符串总是有效的，且原始数据不包含数字，所有数字只表示重复的次数。
 *
 * ——— 示例 ———
 * 输入： s = "3[a]2[bc]"
 * 输出： "aaabcbc"
 *
 * 输入： s = "3[a2[c]]"
 * 输出： "accaccacc"
 *
 * 输入： s = "2[abc]3[cd]ef"
 * 输出： "abcabccdcdcdef"
 */

/**
 * @param {string} s
 * @return {string}
 */
function decodeString(s) {
}

// —— 自测 ——
console.log(decodeString("3[a]2[bc]")); // "aaabcbc"
console.log(decodeString("3[a2[c]]")); // "accaccacc"
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"

module.exports = { decodeString };
