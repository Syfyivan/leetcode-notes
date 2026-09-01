/**
 * 热题 100 · 矩阵置零
 *
 * 优先级：Hot 100 · P2
 */

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
 *
 * ——— 延伸 ———
 * - 额外 O(m+n) 数组记行列表，更好写，空间多一档。
 * - 不能边走边清：清了会污染还没扫到的格子。
 * - 第一行第一列既是数据又是标记，所以另存两个布尔。
 *
 * ——— 常见追问 ———
 * Q: 为什么最后才清第一行第一列？
 * A: 它们还肩负内部的标记。先清掉，后面读到的 0 就分不清是原值还是标记。
 *
 * Q: 整表都是 0？
 * A: 标记全开，内部和边都会被清，结果仍全 0。
 *
 * Q: 只用一个布尔够不够？
 * A: 不够。第一行要清和第一列要清是两件独立的事。
 *
 * Q: 和 O(m+n) 写法怎么选？
 * A: 面试先写行列表，再压到第一行第一列。正确性比抠空间重要。
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
                matrix[i][0] = 0; // 行首当标记，内部先不动
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
    if (firstRow) { // 内部用完标记之后，才动第一行
        for (let j = 0; j < n; j++) matrix[0][j] = 0;
    }
    if (firstCol) {
        for (let i = 0; i < m; i++) matrix[i][0] = 0;
    }
    return matrix;
}

/**
 * 延伸 1：行列集合版
 *
 * 需求：用更直观的额外空间记录哪些行、列需要清零。
 *
 * 思路：第一遍收集零所在行列，第二遍命中任一集合就写 0。
 *
 * ——— 示例 ———
 * 示例：[[1,1,1],[1,0,1],[1,1,1]] 变为 [[1,0,1],[0,0,0],[1,0,1]]。
 *
 * 复杂度：时间 O(mn)，空间 O(m+n)。
 */
function setZeroesWithSets(matrix) {
  const rows = new Set();
  const cols = new Set();
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col] === 0) { rows.add(row); cols.add(col); }
    }
  }
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (rows.has(row) || cols.has(col)) matrix[row][col] = 0;
    }
  }
  return matrix;
}

// —— 自测 ——
console.log(setZeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]));
// 期望： [[1,0,1],[0,0,0],[1,0,1]]
console.log(setZeroes([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]));
// 期望： [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

module.exports = { setZeroes, setZeroesWithSets };
