/**
 * 螺旋矩阵（LeetCode 54）
 *
 * 给定一个 m x n 的矩阵 matrix，请按照顺时针螺旋顺序，
 * 返回矩阵中的所有元素。
 *
 * ——— 示例 ———
 * 输入： matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * 输出： [1,2,3,6,9,8,7,4,5]
 *
 * 输入： matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
 * 输出： [1,2,3,4,8,12,11,10,9,5,6,7]
 */

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
}

// —— 自测 ——
console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
// 期望： [1,2,3,6,9,8,7,4,5]
console.log(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]));
// 期望： [1,2,3,4,8,12,11,10,9,5,6,7]

module.exports = { spiralOrder };
