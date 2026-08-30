/**
 * 矩阵置零（LeetCode 73）
 *
 * 给定一个 m x n 的整数矩阵 matrix，如果某个元素为 0，
 * 则将其所在行和所在列的所有元素都设为 0。
 * 请原地修改 matrix。
 *
 * 进阶：能否只用常量额外空间完成？
 *
 * ——— 示例 ———
 * 输入： matrix = [[1,1,1],[1,0,1],[1,1,1]]
 * 输出： [[1,0,1],[0,0,0],[1,0,1]]
 *
 * 输入： matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
 * 输出： [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 *
 * 思路：
 * 1. 用第一行第一列当标记，另用两个布尔记下它们自己要不要清零。
 * 2. 扫内部，遇到 0 就把对应行首、列首打 0。
 * 3. 边界：先按标记清内部，最后再清第一行第一列，顺序反了会整表被清。
 * 复杂度：时间 O(mn)，空间 O(1)
 */

/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
function setZeroes(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    let firstRow = false;
    let firstCol = false;
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) firstRow = true;
    }
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) firstCol = true;
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
    if (firstRow) {
        for (let j = 0; j < n; j++) matrix[0][j] = 0;
    }
    if (firstCol) {
        for (let i = 0; i < m; i++) matrix[i][0] = 0;
    }
    return matrix;
}

// —— 自测 ——
console.log(setZeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]));
// 期望： [[1,0,1],[0,0,0],[1,0,1]]
console.log(setZeroes([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]));
// 期望： [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

module.exports = { setZeroes };
