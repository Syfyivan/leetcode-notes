/**
 * 热题 100 · N皇后
 *
 * 优先级：Hot 100 · P2
 */

/**
 * N 皇后（LC51）
 *
 * 按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。
 * n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。
 * 给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。
 * 每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，
 * 该方案中 'Q' 和 '.' 分别代表了皇后和空位。
 *
 * ——— 示例 ———
 * 输入： n = 4
 * 输出： [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
 *
 * 输入： n = 1
 * 输出： [["Q"]]
 *
 * 思路：
 * 1. 一行放一个皇后，列、主对角、副对角用布尔数组标记。
 * 2. 主对角 row-col 相同，副对角 row+col 相同。
 * 3. 边界：放到第 n 行收盘面；回溯时撤标记。
 * 复杂度：时间 O(n!)，空间 O(n)
 */
/**
 * @param {number} n
 * @return {string[][]}
 */
function solveNQueens(n) {
    const res = [];
    const board = Array.from({ length: n }, () => Array(n).fill('.'));
    const cols = new Array(n).fill(false);
    const diag1 = new Array(2 * n - 1).fill(false); // r - c + n - 1
    const diag2 = new Array(2 * n - 1).fill(false); // r + c

    const dfs = (r) => {
        if (r === n) {
            res.push(board.map((row) => row.join(''))); // join 出新串，后续改盘面不影响答案
            return;
        }
        for (let c = 0; c < n; c++) {
            const d1 = r - c + n - 1; // r-c 可能为负，加 n-1 挪到 >=0
            const d2 = r + c;
            if (cols[c] || diag1[d1] || diag2[d2]) continue;
            cols[c] = diag1[d1] = diag2[d2] = true;
            board[r][c] = 'Q';
            dfs(r + 1);
            board[r][c] = '.';
            cols[c] = diag1[d1] = diag2[d2] = false; // 擦掉，同层下一列才能用
        }
    };
    dfs(0);
    return res;
}

/**
 * 延伸 1：只统计方案数（LeetCode 52）
 *
 * 需求：不构造棋盘字符串，只返回 n 皇后的合法摆放数量。
 *
 * 思路：逐行选择列，用列、主对角线 row-col、次对角线 row+col 三个 Set 剪枝。
 *
 * ——— 示例 ———
 * 示例：n=4 输出 2。
 *
 * 复杂度：最坏约 O(n!)，递归空间 O(n)。
 */
function totalNQueens(n) {
  const columns = new Set();
  const diagonals1 = new Set();
  const diagonals2 = new Set();
  let count = 0;
  function place(row) {
    if (row === n) {
      count++;
      return;
    }
    for (let col = 0; col < n; col++) {
      if (columns.has(col) || diagonals1.has(row - col) || diagonals2.has(row + col)) continue;
      columns.add(col); diagonals1.add(row - col); diagonals2.add(row + col);
      place(row + 1);
      columns.delete(col); diagonals1.delete(row - col); diagonals2.delete(row + col);
    }
  }
  place(0);
  return count;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么一行只放一个？
 * A: 皇后同行必攻击。按行递推，每行枚举列，自然避开同行。
 *
 * Q: 主对角、副对角下标怎么算？
 * A: r-c 相同是主对角，有负数所以加 n-1 挪到 0。r+c 相同是副对角。
 *
 * Q: 回溯漏擦标记会怎样？
 * A: 后面的行会以为这些列/对角还被占着，合法解全丢。
 *
 * Q: 为什么 board 要 map join？
 * A: 题目要字符串数组。map 会新开一行字符串，避免盘面被后续 dfs 改掉。
 */

// —— 自测 ——
console.log(solveNQueens(4)); // 期望输出 [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
console.log(solveNQueens(1)); // 期望输出 [["Q"]]

module.exports = { solveNQueens, totalNQueens };
