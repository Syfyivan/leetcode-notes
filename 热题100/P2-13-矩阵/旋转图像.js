/**
 * 热题 100 · 旋转图像
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 旋转图像（LeetCode 48）
 *
 * 给定一个 n x n 的二维矩阵 matrix 表示一个图像，
 * 请将图像顺时针旋转 90 度。
 * 请原地旋转矩阵，不要使用另一个矩阵来旋转图像。
 *
 * ——— 示例 ———
 * 输入： matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * 输出： [[7,4,1],[8,5,2],[9,6,3]]
 *
 * 输入： matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
 * 输出： [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
 *
 * 思路：
 * 1. 先按主对角线转置，再左右翻转每一行，得到顺时针 90 度。
 * 2. 转置只交换 i < j，避免换两次。
 * 3. 边界：原地交换，n 为奇数时中心元素不动。
 * 复杂度：时间 O(n^2)，空间 O(1)
 */

/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
function rotate(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) { // i<j，只换上三角
            const tmp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = tmp;
        }
    }
    for (let i = 0; i < n; i++) {
        matrix[i].reverse(); // 转置后再左右翻 = 顺时针 90
    }
    return matrix;
}

/**
 * 延伸 1：旋转任意 m×n 矩阵
 *
 * 需求：非方阵无法原地旋转，返回一个新的 n×m 顺时针旋转矩阵。
 *
 * 思路：原位置 [row,col] 映射到新位置 [col,rows-1-row]。
 *
 * ——— 示例 ———
 * 示例：[[1,2,3],[4,5,6]] 输出 [[4,1],[5,2],[6,3]]。
 *
 * 复杂度：时间 O(mn)，空间 O(mn)。
 */
function rotateRectangular(matrix) {
  if (!matrix.length) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => new Array(rows));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) result[col][rows - 1 - row] = matrix[row][col];
  }
  return result;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么只交换 i < j？
 * A: 转置沿对角线对称。换两次等于没换。i+1 起步只走下三角。
 *
 * Q: 转置再左右翻为什么是顺时针？
 * A: 转置把 (i,j) 送到 (j,i)，再水平翻到 (j, n-1-i)，正好是顺时针 90。
 *
 * Q: n 为奇数中心怎么办？
 * A: 中心格子映射到自己，两步都碰不到它。
 *
 * Q: 题目为什么禁止新矩阵？
 * A: 原地 O(1) 空间。开新表再抄回去是 O(n^2) 空间，面试会追问。
 */

// —— 自测 ——
console.log(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
// 期望： [[7,4,1],[8,5,2],[9,6,3]]
console.log(rotate([[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]));
// 期望： [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

module.exports = { rotate, rotateRectangular };
