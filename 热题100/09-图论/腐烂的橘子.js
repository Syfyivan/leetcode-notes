/**
 * 腐烂的橘子（LeetCode 994）
 *
 * 在给定的 m x n 网格 grid 中，每个单元格可以有以下三个值之一：
 *   - 0 代表空单元格；
 *   - 1 代表新鲜橘子；
 *   - 2 代表腐烂的橘子。
 * 每分钟，腐烂的橘子周围 4 个方向上相邻的新鲜橘子都会腐烂。
 * 返回直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。
 * 如果不可能，返回 -1。
 *
 * ——— 示例 ———
 * 输入： grid = [[2,1,1],[1,1,0],[0,1,1]]
 * 输出： 4
 *
 * 输入： grid = [[2,1,1],[0,1,1],[1,0,1]]
 * 输出： -1
 *
 * 输入： grid = [[0,2]]
 * 输出： 0
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
function orangesRotting(grid) {
  // TODO
}

// —— 自测 ——
console.log(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]])); // 期望： 4
console.log(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]])); // 期望： -1
console.log(orangesRotting([[0, 2]]));                          // 期望： 0

module.exports = { orangesRotting };
