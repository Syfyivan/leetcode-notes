/**
 * 思路：
 * 1. 第 i 行有 i+1 个数，两端是 1。
 * 2. 中间 res[i][j] = res[i-1][j-1] + res[i-1][j]。
 * 3. 边界：numRows=1 只返回 [[1]]，别预先写好第二行。
 * 复杂度：时间 O(numRows^2)，空间 O(numRows^2)
 *
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const res = [];
    for(let i = 0; i < numRows; i++) {
        res[i] = [];
        res[i][0] = 1;
        res[i][i] = 1;
        for(let j = 1; j < i; j++) {
            res[i][j] = res[i - 1][j -1] + res[i - 1][j];
        }
    }
    return res;
};
