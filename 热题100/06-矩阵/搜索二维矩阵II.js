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
 */

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function searchMatrix(matrix, target) {
  // TODO
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
