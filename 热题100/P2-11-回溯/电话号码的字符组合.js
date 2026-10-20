/**
 * 热题 100 · 电话号码的字符组合
 *
 * 优先级：Hot 100 · P2
 */

/**
 * @param {string} digits
 * @return {string[]}
 *
 * 思路：
 * 1. 数字到字母的映射表，按 digits 下标逐位展开。
 * 2. 当前位每个字母都试一遍，index+1 进下一位。
 * 3. 边界：digits 为空直接返回 []；index 走到长度才 join 收集。
 * 复杂度：时间 O(4^n)，空间 O(n)
 */
var letterCombinations = function(digits) {
    let res = [];
    let path = [];
    const map = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}

    if(digits.length === 0) return res; // 题目约定空输入没有组合，别收 ""
    const dfs = (index) => {
        if(index === digits.length) {
            res.push(path.join('')); // 每位都填完才是一个组合
            return;
        }
        const letters = map[digits[index]];
        for(const ch of letters) {
            path.push(ch);
            dfs(index + 1);
            path.pop();
        }
    }
    dfs(0);
    return res;
};

/**
 * 延伸 1：队列迭代生成
 *
 * 需求：不用递归，每读一个数字就把已有前缀与它的所有字母做笛卡尔积。
 *
 * 思路：结果从 [''] 起步；每轮创建 next，遍历 prefix 和当前数字对应字母。
 *
 * ——— 示例 ———
 * 示例："23" 输出 ["ad","ae","af","bd","be","bf","cd","ce","cf"]。
 *
 * 复杂度：结果规模 O(4^n)，空间 O(4^n)。
 */
function letterCombinationsIterative(digits) {
  if (!digits) return [];
  const mapping = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  let result = [''];
  for (const digit of digits) {
    const next = [];
    for (const prefix of result) for (const char of mapping[Number(digit)]) next.push(prefix + char);
    result = next;
  }
  return result;
}

/**
 * ——— 常见追问 ———
 * Q: 空串为什么返回 [] 不是 [""]？
 * A: 题目约定。0 个数字没有组合。别漏这句，否则 dfs(0) 会收一个空串。
 *
 * Q: 为什么不用 start？
 * A: 每层候选来自不同数字，格子本身就不重叠，按下标往前走即可。
 *
 * Q: 必须 pop 吗？
 * A: 必须。同一位要试多个字母，不 pop 下一位会叠在旧字母后面。
 *
 * Q: 时间怎么估？
 * A: 每位最多 4 个字母，n 位就是 4^n 种，每种再 O(n) join。
 */

// —— 自测 ——
console.log(letterCombinations('23').length); // 9

module.exports = { letterCombinations, letterCombinationsIterative };
