/**
 * 字符串解码（LeetCode 394）
 *
 * 给定一个经过编码的字符串，返回它解码后的字符串。
 * 编码规则为 k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
 * 输入字符串总是有效的，且原始数据不包含数字，所有数字只表示重复的次数。
 *
 * 思路：
 * 1. 两个栈：numStack 存倍数，strStack 存遇到 [ 之前已经拼好的串。
 * 2. 数字累乘 10 拼出倍数；遇到 [ 把当前串和倍数入栈，清空重开。
 * 3. 遇到 ] 弹出倍数和上一层串，cur = 上一层 + cur 重复倍数次。
 * 4. 边界：倍数可能是多位数。括号可以嵌套，靠栈一层层还原。
 * 复杂度：时间 O(解码后长度)，空间 O(解码后长度)
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
  const numStack = [];
  const strStack = [];
  let cur = '';
  let num = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + Number(ch); // 倍数可能多位
    } else if (ch === '[') {
      numStack.push(num);
      strStack.push(cur);
      num = 0;
      cur = '';
    } else if (ch === ']') {
      const times = numStack.pop();
      const prev = strStack.pop();
      cur = prev + cur.repeat(times);
    } else {
      cur += ch;
    }
  }
  return cur;
}

// —— 自测 ——
console.log(decodeString("3[a]2[bc]")); // "aaabcbc"
console.log(decodeString("3[a2[c]]")); // "accaccacc"
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"

module.exports = { decodeString };
