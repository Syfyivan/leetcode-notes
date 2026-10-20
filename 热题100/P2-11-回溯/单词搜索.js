/**
 * 热题 100 · 单词搜索
 *
 * 优先级：Hot 100 · P2
 */

/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 *
 * 思路：
 * 1. 每个格子当起点，四方向 DFS 匹配 word。
 * 2. 走进去把格子改成 '#' 盖章，退回时还原。
 * 3. 边界：越界或字符对不上立刻 false；匹配到最后一个字符 true。
 * 复杂度：时间 O(mn * 4^L)，空间 O(L)
 */
var exist = function(board, word) {
    const n = board.length;
    const m = board[0].length;

    const dfs = (x, y, index) => {
        if(x < 0 || x >= m || y < 0 || y >= n) {
            return false;
        }
        if(word[index] != board[y][x]) {
            return false;
        }
        if(index === word.length - 1) return true; // 当前格对上最后一个字符，整词完成

        board[y][x] = '#'; // 盖章，防止回头走同一格
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        for(const [i, j] of dirs) {
            if(dfs(x + j, y + i, index + 1)) return true;
        }
        board[y][x] = word[index]; // 回溯还原
        return false;
    }
    for(let i = 0; i < n; i++) {
            for(let j = 0; j < m; j++) {
               if(dfs(j, i, 0) ) return true;
            }
        }
    return false;
};

/**
 * 延伸 1：返回一条匹配路径
 *
 * 需求：找到单词时返回 [[row,col], ...]，找不到返回 null。
 *
 * 思路：DFS 路径中临时标记访问；字符全部匹配后复制坐标路径。
 *
 * ——— 示例 ———
 * 示例：ABCCED 在示例棋盘中可返回长度为 6 的相邻坐标数组。
 *
 * 复杂度：时间 O(rows*cols*4^word.length)，栈 O(word.length)。
 */
function findWordPath(board, word) {
  const rows = board.length;
  const cols = rows ? board[0].length : 0;
  const path = [];
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function search(row, col, index) {
    if (index === word.length) return true;
    if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col] !== word[index]) return false;
    const char = board[row][col];
    board[row][col] = '#';
    path.push([row, col]);
    for (const [dr, dc] of directions) {
      if (search(row + dr, col + dc, index + 1)) {
        board[row][col] = char;
        return true;
      }
    }
    path.pop();
    board[row][col] = char;
    return false;
  }
  if (word === '') return [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (search(row, col, 0)) return path.slice();
    }
  }
  return null;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么改成 '#'？
 * A: 同一格不能走两次。盖章当 vis，回溯再写回字符。
 *
 * Q: 找到为什么一路 return true？
 * A: 只要存在一条路径。找到就剪掉其余搜索，抬回顶层。
 *
 * Q: 坐标 x/y 和 n/m 怎么对应？
 * A: 这里 n 是行数、m 是列数，dfs(x, y) 的 x 是列、y 是行。写反会越界或漏格子。
 *
 * Q: 时间怎么估？
 * A: 每个格子当起点，之后每步 4 个方向、深度 L，上界 mn * 4^L。
 */

// —— 自测 ——
console.log(exist([['A', 'B'], ['C', 'D']], 'AB')); // true

module.exports = { exist, findWordPath };
