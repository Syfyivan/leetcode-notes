/**
 * 热题 100 · 有效的括号
 *
 * 优先级：Hot 100 · P1
 */

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
 *
 * ——— 延伸 ———
 * - 只含一种括号：计数，左 +1 右 -1，中途 < 0 或结束非 0 就 false。
 * - 最长有效括号：栈存下标，或 DP。
 * - 生成有效括号：回溯，左有剩就放左，右比左少就放右。
 *
 * ——— 常见追问 ———
 * Q: 为什么用栈不用计数？
 * A: 三种括号还要配对类型和顺序。([)] 计数过、类型交叉，必须看栈顶。
 *
 * Q: 栈空来了右括号？
 * A: pop 得到 undefined，跟 pair[ch] 对不上，false。
 *
 * Q: 扫完栈非空？
 * A: 有左括号没合上。return stack.length === 0。
 *
 * Q: 空串？
 * A: 有效。循环不进，栈空，true。
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
      if (stack.pop() !== pair[ch]) return false; // 栈空 pop 出 undefined，也算配对失败
    }
  }
  return stack.length === 0; // 还有左括号没合上
}

/**
 * 延伸 1：使圆括号有效的最少添加次数（LeetCode 921）
 *
 * 需求：字符串只含 '(' 和 ')'，可在任意位置添加括号，求最少添加数。
 *
 * 思路：balance 记录未匹配左括号；遇到多余右括号就计入 missingLeft。
 *
 * ——— 示例 ———
 * 示例："()))((" 输出 4。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 */
function minAddToMakeValid(s) {
  let balance = 0;
  let missingLeft = 0;
  for (const char of s) {
    if (char === '(') balance++;
    else if (balance > 0) balance--;
    else missingLeft++;
  }
  return balance + missingLeft;
}

// —— 自测 ——
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false

module.exports = { isValid, minAddToMakeValid };
