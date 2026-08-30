/**
 * 搜索二维矩阵 II（LeetCode 240）
 *
 * 编写一个高效的算法来搜索 m x n 矩阵 matrix 中的目标值 target。
 * 该矩阵具有以下特性：
 *   - 每行的元素从左到右升序排列。
 *   - 每列的元素从上到下升序排列。
 * 若矩阵中存在 target 返回 true，否则返回 false。
 *
 * ——— 示例 ———
 * 输入： matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
 * 输出： true
 *
 * 输入： 同上矩阵, target = 20
 * 输出： false
 *
 * 思路：
 * 1. 从右上角出发：当前值太大往左，太小往下。
 * 2. 每步排除一行或一列。
 * 3. 边界：走出矩阵即找不到。
 * 复杂度：时间 O(m+n)，空间 O(1)
 */

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function searchMatrix(matrix, target) {
    if (!matrix.length) return false;
    const m = matrix.length;
    const n = matrix[0].length;
    let i = 0;
    let j = n - 1; // 右上角：左边更小、下边更大
    while (i < m && j >= 0) {
        if (matrix[i][j] === target) return true;
        if (matrix[i][j] > target) j--;
        else i++;
    }
    return false;
}

// —— 自测 ——
const m = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];
console.log(searchMatrix(m, 5));  // 期望： true
console.log(searchMatrix(m, 20)); // 期望： false

module.exports = { searchMatrix };
