/**
 * 有效的括号（LeetCode 20）
 *
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。
 * 有效字符串需满足：左括号必须用相同类型的右括号闭合；左括号必须以正确的顺序闭合；
 * 每个右括号都有一个对应的相同类型的左括号。
 *
 * 思路：
 * 1. 左括号入栈。右括号弹出栈顶，看是不是对应的左括号。
 * 2. 配对：) 对 (，] 对 [，} 对 {。
 * 3. 边界：栈空还来右括号是 false。扫完栈必须空。
 * 复杂度：时间 O(n)，空间 O(n)
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
  const pair = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      if (stack.pop() !== pair[ch]) return false;
    }
  }
  return stack.length === 0;
}

// —— 自测 ——
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false

module.exports = { isValid };
