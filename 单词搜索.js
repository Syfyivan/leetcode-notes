/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
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
        
        board[y][x] = '#';
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        for(const [i, j] of dirs) {
            if(dfs(x + j, y + i, index + 1)) return true;
        }
        board[y][x] = word[index];
        return false;
    }
    for(let i = 0; i < n; i++) {
            for(let j = 0; j < m; j++) {
               if(dfs(j, i, 0) ) return true;
            }
        }
    return false;
};