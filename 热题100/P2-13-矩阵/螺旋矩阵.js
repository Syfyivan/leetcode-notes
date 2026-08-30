/**
 * 螺旋矩阵（LeetCode 54）
 *
 * 给定一个 m x n 的矩阵 matrix，请按照顺时针螺旋顺序，
 * 返回矩阵中的所有元素。
 *
 * ——— 示例 ———
 * 输入： matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * 输出： [1,2,3,6,9,8,7,4,5]
 *
 * 输入： matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
 * 输出： [1,2,3,4,8,12,11,10,9,5,6,7]
 *
 * 思路：
 * 1. 维护上下左右四条边界，按右→下→左→上走圈。
 * 2. 走完一边就收缩对应边界。
 * 3. 边界：收缩后要判断上下/左右是否交叉，单行单列否则会重复。
 * 复杂度：时间 O(mn)，空间 O(1)
 */

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
    const res = [];
    if (!matrix.length) return res;
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) res.push(matrix[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
        right--;
        if (top <= bottom) { // 收缩后还剩行才走底边，避免单行重复
            for (let j = right; j >= left; j--) res.push(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) { // 收缩后还剩列才走左边，避免单列重复
            for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
            left++;
        }
    }
    return res;
}

// —— 自测 ——
console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
// 期望： [1,2,3,6,9,8,7,4,5]
console.log(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]));
// 期望： [1,2,3,4,8,12,11,10,9,5,6,7]

module.exports = { spiralOrder };
