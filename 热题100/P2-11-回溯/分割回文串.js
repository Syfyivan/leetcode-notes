/**
给你一个字符串 s，请你将 s 分割成一些 子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。

输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
 * 思路：
 * 1. 枚举切点，前缀是回文才切一刀，对剩余串继续切。
 * 2. 剩余为空时收一份 path 拷贝。
 * 3. 边界：单字符一定是回文；切完必须 pop。
 * 复杂度：时间 O(n * 2^n)，空间 O(n)
 */
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function(s) {
    const res = [];
    const path = [];

    const judge = (str) => {
        const len = str.length;
        if(len === 1) return true;
        let right = len - 1;
        for(let i = 0; i < right; i++) {
            if(str[i] != str[right]) {
                return false
            }
            right--
        }
        return true;
    }

    const dfs = (str) => {
        if(str.length === 0) {
            res.push([...path]);
            return;}
        for(let i = 1; i <= str.length; i++) {
            const tmp = str.slice(0, i);
            if(judge(tmp)) {
                path.push(tmp);
                dfs(str.slice(i, str.length));
                path.pop();
            }
        }
    }
    dfs(s);
    return res;
};
