/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const res = [];
    res[0] = [1];
    res[1] = [1, 1];
    for(let i = 2; i < numRows; i++) {
        res[i] = [];
        res[i][0] = 1;
        res[i][i] = 1;
        for(let j = 1; j < i; j++) {
            res[i][j] = res[i - 1][j -1] + res[i - 1][j];
        }
    }
    return res;
};