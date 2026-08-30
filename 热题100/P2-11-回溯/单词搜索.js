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
        if(index === word.length - 1) return true;
        
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
