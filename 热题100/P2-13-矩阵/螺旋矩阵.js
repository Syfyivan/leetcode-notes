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
 *
 * ——— 延伸 ———
 * - 螺旋矩阵 II：同一套方向，往空表里填 1..n^2。
 * - 方向数组 + vis：撞边或走过就右转。
 * - 一圈一圈算坐标，适合固定 n×n。
 *
 * ——— 常见追问 ———
 * Q: 单行为什么会重复？
 * A: 上边走完 top++，如果没有 if (top <= bottom) 又从右往左把同一行走一遍。
 *
 * Q: 为什么走完上边立刻 top++？
 * A: 右上角那格已经收过。不缩，右边下行会再收一次。
 *
 * Q: 空矩阵？
 * A: matrix.length 为 0 直接返回 []。
 *
 * Q: 长方形 m != n？
 * A: 四条边独立收缩，循环条件是 top<=bottom 且 left<=right，长宽不等也能走完。
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
