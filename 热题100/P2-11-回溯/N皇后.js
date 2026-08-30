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
            res.push(board.map((row) => row.join('')));
            return;
        }
        for (let c = 0; c < n; c++) {
            const d1 = r - c + n - 1;
            const d2 = r + c;
            if (cols[c] || diag1[d1] || diag2[d2]) continue;
            cols[c] = diag1[d1] = diag2[d2] = true;
            board[r][c] = 'Q';
            dfs(r + 1);
            board[r][c] = '.';
            cols[c] = diag1[d1] = diag2[d2] = false;
        }
    };
    dfs(0);
    return res;
}

// —— 自测 ——
console.log(solveNQueens(4)); // 期望输出 [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
console.log(solveNQueens(1)); // 期望输出 [["Q"]]

module.exports = { solveNQueens };
