/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 *
 * 思路：
 * 1. 每行行首大于上一行行尾，整表拉直成一条有序数组。
 * 2. 下标 mid 映射到 matrix[mid / n][mid % n]。
 * 3. 边界：空表直接 false；闭区间 left <= right，相等返回 true。
 * 复杂度：时间 O(log(mn))，空间 O(1)
 */
var searchMatrix = function(matrix, target) {
    let m = matrix.length
    let left = 0; 
    let n = matrix[0].length;
    let right = m * n - 1;
    
    while(left <= right) {
        const mid = Math.floor((left + right ) / 2);
        const val = matrix[Math.floor(mid / n)][mid % n] // 一维下标还原行列
        if(val === target) return true;
        else if(val < target)  left = mid + 1;
        else right = mid - 1;
    }
    return false;
};
