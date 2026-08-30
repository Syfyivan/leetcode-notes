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
 *
 * 思路：
 * 1. 所有烂橘同时入队，多源 BFS。
 * 2. 每层分钟 +1，把相邻鲜橘变烂。
 * 3. 边界：一开始没有鲜橘返回 0；结束还有鲜橘返回 -1。
 * 复杂度：时间 O(mn)，空间 O(mn)
 *
 * ——— 延伸 ———
 * - 多源最短路模板：墙壁与门、火蔓延同一套路。
 * - 不想改原表：另开时间数组。
 * - 没有烂橘但有鲜橘：fresh 减不完，返回 -1。
 *
 * ——— 常见追问 ———
 * Q: 为什么所有烂橘一起入队？
 * A: 它们第 0 分钟同时开始传。多源 BFS，一层就是一分钟。
 *
 * Q: 为什么先判断 fresh === 0？
 * A: 没有鲜橘不用传，答案是 0。不提前返回会走进循环把 minutes 加错。
 *
 * Q: 分钟数什么时候 +1？
 * A: 每扩完一层、并且还剩鲜橘要传，才进入下一分钟。
 *
 * Q: 空格挡住吗？
 * A: 挡住。grid 为 0 的格子 continue，腐烂绕不过去。
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
function orangesRotting(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const q = [];
    let fresh = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 2) q.push([i, j]);
            else if (grid[i][j] === 1) fresh++;
        }
    }
    if (fresh === 0) return 0; // 没有鲜橘，0 分钟已经完成

    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let minutes = 0;
    let head = 0;
    while (head < q.length && fresh) {
        const size = q.length - head;
        minutes++; // 还有鲜橘才进入下一分钟
        for (let s = 0; s < size; s++) {
            const [x, y] = q[head++];
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || nx >= m || ny < 0 || ny >= n || grid[nx][ny] !== 1) continue;
                grid[nx][ny] = 2;
                fresh--;
                q.push([nx, ny]);
            }
        }
    }
    return fresh === 0 ? minutes : -1;
}

// —— 自测 ——
console.log(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]])); // 期望： 4
console.log(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]])); // 期望： -1
console.log(orangesRotting([[0, 2]]));                          // 期望： 0

module.exports = { orangesRotting };
