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
 *
 * ——— 延伸 ———
 * - DP：dp[i] 表示以 i 结尾的最长有效长度。')(' 接不上。
 * - 左右各扫一遍计数：左多于右就重置，省栈。
 * - 判断是否有效：本题的栈改成只关心空不空。
 *
 * ——— 常见追问 ———
 * Q: 栈底为什么先压 -1？
 * A: 当「上一段无效位置」。() 从 0 开始，长度 = 1 - (-1) = 2。
 *
 * Q: 栈空为什么压当前 i？
 * A: 多出来的 ) 把有效段切断。它成为新基准，后面的长度从这里算。
 *
 * Q: 为什么弹完再看栈空？
 * A: ) 先配对弹一个 (。弹完还有东西，说明前面有未配的 ( 或基准，这段是连上的。
 *
 * Q: 求的是子串还是子序列？
 * A: 子串，必须连续。有效段中间插一个废 ) 就要从新基准算。
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
