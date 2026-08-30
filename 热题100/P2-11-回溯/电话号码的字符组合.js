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

    if(digits.length === 0) return res;
    const dfs = (index) => {
        if(index === digits.length) {
            res.push(path.join(''));
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
