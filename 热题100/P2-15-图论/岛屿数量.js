/**
 * 热题 100 · 岛屿数量
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 岛屿数量（LeetCode 200）
 *
 * 给定一个由字符 '1'（陆地）和 '0'（水）组成的二维网格 grid，
 * 请计算网格中岛屿的数量。
 * 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
 * 此外，可以假设该网格的四条边均被水包围。
 *
 * ——— 示例 ———
 * 输入： grid = [
 *   ["1","1","1","1","0"],
 *   ["1","1","0","1","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","0","0","0"]
 * ]
 * 输出： 1
 *
 * 输入： grid = [
 *   ["1","1","0","0","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","1","0","0"],
 *   ["0","0","0","1","1"]
 * ]
 * 输出： 3
 *
 * 思路：
 * 1. 碰到 '1' 计数 +1，DFS 把连通陆地改成 '0' 沉岛。
 * 2. 四方向扩散。
 * 3. 边界：越界或已是水就停。
 * 复杂度：时间 O(mn)，空间 O(mn)
 *
 * ——— 延伸 ———
 * - BFS 沉岛：队列扩散，网格很深时不怕爆栈。
 * - 并查集：相邻陆地合并，连通块数就是答案。
 * - 岛屿最大面积：沉的时候顺便计数，取 max。
 *
 * ——— 常见追问 ———
 * Q: 为什么改成 '0'？
 * A: 沉岛兼 vis。不沉的话同一座岛会被反复计数。
 *
 * Q: 斜对角算相连吗？
 * A: 不算。题目只认上下左右。dirs 不要加四个角。
 *
 * Q: 全是水？
 * A: 碰不到 '1'，count 保持 0。
 *
 * Q: DFS 和 BFS 怎么选？
 * A: 连通块都行。递归深度最坏 mn，JS 栈浅时换 BFS。
 */

/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1') return;
        grid[i][j] = '0'; // 沉岛，兼作 vis
        for (const [di, dj] of dirs) dfs(i + di, j + dj);
    };

    let count = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                count++; // 新岛，随后把连通陆地全沉掉
                dfs(i, j);
            }
        }
    }
    return count;
}

/**
 * 延伸 1：岛屿的最大面积
 *
 * 需求：在同样的四方向连通规则下，返回最大岛屿包含的陆地格数。
 *
 * 思路：每遇到一块未访问陆地就用栈完成一次 DFS，并累计本次连通块面积。
 *
 * ——— 示例 ———
 * 示例：maxAreaOfIsland([[1,1,0],[0,1,0],[1,0,1]]) => 3
 *
 * 复杂度：时间 O(mn)，空间 O(mn)
 */
function maxAreaOfIsland(grid) {
    if (grid.length === 0 || grid[0].length === 0) return 0;
    const rows = grid.length;
    const cols = grid[0].length;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let maxArea = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] !== 1 && grid[row][col] !== '1') continue;
            const stack = [[row, col]];
            grid[row][col] = 0;
            let area = 0;
            while (stack.length) {
                const [x, y] = stack.pop();
                area++;
                for (const [dx, dy] of dirs) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || nx >= rows || ny < 0 || ny >= cols) continue;
                    if (grid[nx][ny] !== 1 && grid[nx][ny] !== '1') continue;
                    grid[nx][ny] = 0;
                    stack.push([nx, ny]);
                }
            }
            maxArea = Math.max(maxArea, area);
        }
    }
    return maxArea;
}

// —— 自测 ——
console.log(numIslands([
  ["1", "1", "1", "1", "0"],
  ["1", "1", "0", "1", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "0", "0", "0"],
])); // 期望： 1
console.log(numIslands([
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
])); // 期望： 3
console.log(maxAreaOfIsland([[1, 1, 0], [0, 1, 0], [1, 0, 1]])); // 期望： 3

module.exports = { numIslands, maxAreaOfIsland };
