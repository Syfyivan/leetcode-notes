/**
 * @param {string} digits
 * @return {string[]}
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