/**
 * 热题 100 · 搜索二维矩阵II
 *
 * 优先级：Hot 100 · P2
 */

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
        if (matrix[i][j] > target) j--; // 这一列下面更大，整列可丢
        else i++; // 这一行左边更小，整行可丢
    }
    return false;
}

/**
 * 延伸 1：返回目标坐标
 *
 * 需求：找到 target 时返回 [row,col]，不存在返回 [-1,-1]。
 *
 * 思路：仍从右上角出发；当前偏大向左，偏小向下。
 *
 * ——— 示例 ———
 * 示例：示例矩阵中查找 5 返回 [1,1]。
 *
 * 复杂度：时间 O(rows+cols)，空间 O(1)。
 */
function searchMatrixPosition(matrix, target) {
  if (!matrix.length || !matrix[0].length) return [-1, -1];
  let row = 0;
  let col = matrix[0].length - 1;
  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) return [row, col];
    if (matrix[row][col] > target) col--;
    else row++;
  }
  return [-1, -1];
}

/**
 * ——— 常见追问 ———
 * Q: 为什么从右上角走？
 * A: 左边更小、下边更大，一次比较能排除一整行或一整列。
 *
 * Q: 从左上角为什么不行？
 * A: 左上两边都更大，比较完不知道该往哪边丢。没有单调方向。
 *
 * Q: 空矩阵？
 * A: matrix.length 为 0 直接 false，后面不要读 [0]。
 *
 * Q: 有重复值呢？
 * A: 相等立刻返回 true。重复不影响排除逻辑。
 */

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

module.exports = { searchMatrix, searchMatrixPosition };
