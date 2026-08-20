/**
 * 有效的括号（LeetCode 20）
 *
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。
 * 有效字符串需满足：左括号必须用相同类型的右括号闭合；左括号必须以正确的顺序闭合；
 * 每个右括号都有一个对应的相同类型的左括号。
 *
 * ——— 示例 ———
 * 输入： s = "()"
 * 输出： true
 *
 * 输入： s = "()[]{}"
 * 输出： true
 *
 * 输入： s = "(]"
 * 输出： false
 */

/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
}

// —— 自测 ——
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false

module.exports = { isValid };
