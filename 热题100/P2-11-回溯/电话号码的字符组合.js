/**
 * @param {string} digits
 * @return {string[]}
 *
 * 思路：
 * 1. 数字到字母的映射表，按 digits 下标逐位展开。
 * 2. 当前位每个字母都试一遍，index+1 进下一位。
 * 3. 边界：digits 为空直接返回 []；index 走到长度才 join 收集。
 * 复杂度：时间 O(4^n)，空间 O(n)
 *
 * ——— 延伸 ———
 * - 7、9 对应 4 个字母，映射表别写成 3 个。
 * - 迭代：队列一层层扩，本质还是笛卡尔积。
 * - 没有 0、1，映射里不要留空串，否则会多出废组合。
 *
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
