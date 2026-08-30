/**
 * 最长有效括号（LeetCode 32）
 *
 * 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。
 *
 * 思路：
 * 1. 栈里放下标，栈底先压 -1 当基准。
 * 2. '(' 压下标。')' 先弹，栈空就把当前 i 当新基准；不空则长度 = i - 栈顶。
 * 3. 边界：空串返回 0。开头就是 ')' 时基准会被更新成它的下标。
 * 复杂度：时间 O(n)，空间 O(n)
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
  const stack = [-1]; // 栈底放基准下标
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) {
        stack.push(i); // 新的基准，当前这段已经对不上了
      } else {
        best = Math.max(best, i - stack[stack.length - 1]);
      }
    }
  }
  return best;
}

// —— 自测 ——
console.log(longestValidParentheses("(()")); // 2
console.log(longestValidParentheses(")()())")); // 4
console.log(longestValidParentheses("")); // 0

module.exports = { longestValidParentheses };
