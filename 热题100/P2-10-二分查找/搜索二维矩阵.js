/**
 * 热题 100 · 搜索二维矩阵
 *
 * 优先级：Hot 100 · P2
 */

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 *
 * 思路：
 * 1. 每行行首大于上一行行尾，整表拉直成一条有序数组。
 * 2. 下标 mid 映射到 matrix[mid / n][mid % n]。
 * 3. 边界：空表直接 false；闭区间 left <= right，相等返回 true。
 * 复杂度：时间 O(log(mn))，空间 O(1)
 */
var searchMatrix = function(matrix, target) {
    let m = matrix.length
    let left = 0; 
    let n = matrix[0].length;
    let right = m * n - 1;

    while(left <= right) {
        const mid = Math.floor((left + right ) / 2);
        const val = matrix[Math.floor(mid / n)][mid % n] // 一维下标还原行列：行 = 商，列 = 余
        if(val === target) return true;
        else if(val < target)  left = mid + 1; // 闭区间，mid 已经看过，必须丢掉
        else right = mid - 1;
    }
    return false;
};

/**
 * 延伸 1：返回目标坐标
 *
 * 需求：矩阵整体可视为升序一维数组；找到时返回 [row,col]，否则返回 [-1,-1]。
 *
 * 思路：二分虚拟下标 index，用 floor(index/cols) 和 index%cols 映射坐标。
 *
 * ——— 示例 ———
 * 示例：[[1,3,5],[7,9,11]] 查找 9，输出 [1,1]。
 *
 * 复杂度：时间 O(log(rows*cols))，空间 O(1)。
 */
function searchMatrixPosition(matrix, target) {
  if (!matrix.length || !matrix[0].length) return [-1, -1];
  const cols = matrix[0].length;
  let left = 0;
  let right = matrix.length * cols - 1;
  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);
    const row = Math.floor(middle / cols);
    const col = middle % cols;
    if (matrix[row][col] === target) return [row, col];
    if (matrix[row][col] < target) left = middle + 1;
    else right = middle - 1;
  }
  return [-1, -1];
}

/**
 * ——— 常见追问 ———
 * Q: 为什么能当成一维数组？
 * A: 每行行首大于上一行行尾，整表递增。拉直后仍有序。
 *
 * Q: 空矩阵怎么处理？
 * A: matrix.length 为 0 时不要读 matrix[0]。本题实现没写，面试要补。
 *
 * Q: 和搜索二维矩阵 II 差在哪？
 * A: 74 行与行衔接，能 log(mn)。240 只保证行内、列内有序，要从边角走。
 *
 * Q: 为什么用闭区间？
 * A: 精确查找，相等立刻返回。左右都可能是答案，left <= right 才不会漏中点。
 */

// —— 自测 ——
console.log(searchMatrix([[1, 3, 5], [7, 9, 11]], 9)); // true

module.exports = { searchMatrix, searchMatrixPosition };
