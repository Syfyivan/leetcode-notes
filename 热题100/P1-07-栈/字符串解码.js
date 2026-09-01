/**
 * 热题 100 · 字符串解码
 *
 * 优先级：Hot 100 · P1
 */

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
 *
 * ——— 延伸 ———
 * - 只一层括号：不必栈，扫到 ] 把当前段 repeat。
 * - 递归下降：遇数字读 k，遇 [ 递归解码到 ]。
 * - 嵌套 HTML / XML：同一套栈，遇到闭标签弹开标签。
 *
 * ——— 常见追问 ———
 * Q: 为什么两个栈？
 * A: 倍数和字符串不是一类。一层 [ 同时记下「外面已写好的串」和「这一层重复几次」。
 *
 * Q: 多位数怎么拼？
 * A: num = num * 10 + ch。遇 [ 才把 num 入栈并清零。
 *
 * Q: 为什么遇 [ 要把 cur 入栈并清空？
 * A: [ 开启新一层。外层已写的串先存着，里层从空白拼，] 时再拼回去。
 *
 * Q: 空括号 3[]？
 * A: 题目保证合法。cur 是空串，repeat 还是空。
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
      strStack.push(cur); // 外层已写好的串先压住，里层从空白重开
      num = 0;
      cur = '';
    } else if (ch === ']') {
      const times = numStack.pop();
      const prev = strStack.pop();
      cur = prev + cur.repeat(times); // 拼回外层：prev + 本层重复 times 次
    } else {
      cur += ch;
    }
  }
  return cur;
}

/**
 * 延伸 1：递归下降解码
 *
 * 需求：用共享指针解析嵌套括号，遇到 ']' 返回当前层结果。
 *
 * 思路：数字累积倍数；普通字符直接追加；'[' 后递归解析子串并 repeat。
 *
 * ——— 示例 ———
 * 示例："3[a2[c]]" 输出 "accaccacc"。
 *
 * 复杂度：时间 O(输出长度)，递归栈 O(嵌套深度)。
 */
function decodeStringRecursive(s) {
  let index = 0;
  function parse() {
    let result = '';
    let count = 0;
    while (index < s.length && s[index] !== ']') {
      const char = s[index++];
      if (/\d/.test(char)) count = count * 10 + Number(char);
      else if (char === '[') {
        const nested = parse();
        index++;
        result += nested.repeat(count);
        count = 0;
      } else result += char;
    }
    return result;
  }
  return parse();
}

// —— 自测 ——
console.log(decodeString("3[a]2[bc]")); // "aaabcbc"
console.log(decodeString("3[a2[c]]")); // "accaccacc"
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"

module.exports = { decodeString, decodeStringRecursive };
