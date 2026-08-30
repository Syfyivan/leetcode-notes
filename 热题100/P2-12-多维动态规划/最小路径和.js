/**
 * 64. 最小路径和
 *
 * 给定一个包含非负整数的 m x n 网格 grid，请找出一条从左上角到右下角的路径，
 * 使得路径上的数字总和为最小。
 *
 * 说明：每次只能向下或者向右移动一步。
 *
 * 示例 1：
 *   grid = [[1,3,1],
 *           [1,5,1],
 *           [4,2,1]]
 *   输出：7
 *   解释：路径 1→3→1→1→1 的总和最小。
 *
 * 示例 2：
 *   grid = [[1,2,3],
 *           [4,5,6]]
 *   输出：12
 *
 * 提示：
 *   m == grid.length
 *   n == grid[i].length
 *   1 <= m, n <= 200
 *   0 <= grid[i][j] <= 200
 *
 * 思路：
 * 1. dp[i][j] = grid[i][j] + min(上, 左)。
 * 2. 第一行只能从左累加，第一列只能从上累加。
 * 3. 边界：先填两条边，再填内部，避免越界取 min。
 * 复杂度：时间 O(mn)，空间 O(mn)
 *
 * ——— 延伸 ———
 * - 原地改 grid：左边和上边当 dp，省数组。
 * - 四个方向走：有环，改 Dijkstra。
 * - 打印路径：再记一个来向 prev。
 *
 * ——— 常见追问 ———
 * Q: 为什么先填第一行第一列？
 * A: 边上的格子只有一个来源。内部取 min 时上、左都已经是最终值。
 *
 * Q: 和不同路径差在哪？
 * A: 那边计数用加，这边求最小用 min。骨架同一张表。
 *
 * Q: 格子有负数呢？
 * A: 本题非负，贪心「只往右下」才对。有负数可能要绕路，转移要改。
 *
 * Q: 空间压到一行？
 * A: 可以。dp[j] = grid[i][j] + min(dp[j], dp[j-1])，dp[j] 是旧的上方。
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array.from({length: m}, () => new Array(n).fill(0));
    dp[0][0] = grid[0][0];
    for(let i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0]; // 第一列只能从上走
    }
    for(let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j]; // 第一行只能从左走
    }
    for(let i = 1; i < m; i++) {
        for(let j = 1; j < n; j++) {
            dp[i][j] = Math.min(dp[i - 1][j] + grid[i][j], dp[i][j - 1] + grid[i][j] ); // 上、左都已是最终最小
        }
    }
    return dp[m - 1][n - 1];

};
