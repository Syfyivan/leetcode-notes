/**
 * 最长有效括号（LeetCode 32）
 *
 * 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。
 *
 * ——— 示例 ———
 * 输入： s = "(()"
 * 输出： 2
 *
 * 输入： s = ")()())"
 * 输出： 4
 *
 * 输入： s = ""
 * 输出： 0
 */

/**
 * @param {string} s
 * @return {number}
 */
function longestValidParentheses(s) {
  // TODO
}

// —— 自测 ——
console.log(longestValidParentheses("(()")); // 2
console.log(longestValidParentheses(")()())")); // 4
console.log(longestValidParentheses("")); // 0

module.exports = { longestValidParentheses };
