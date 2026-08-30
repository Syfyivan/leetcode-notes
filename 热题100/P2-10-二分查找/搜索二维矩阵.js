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
 *
 * ——— 延伸 ———
 * - 行内有序但行间不衔接：不能拉直，改走 240 的右上角。
 * - 每行单独二分：O(m log n)，行首已经大于 target 可提前停。
 * - 下标还原：row = mid / n，col = mid % n。
 *
 * ——— 常见追问 ———
 * Q: 为什么能当成一维数组？
 * A: 每行行首大于上一行行尾，整表递增。拉直后仍有序。
 *
 * Q: 空矩阵怎么处理？
 * A: matrix.length 为 0 时不要读 matrix[0]。本题实现没写，面试要补。
 *
 * Q: 和搜索二维矩阵 II 差在哪？
 * A: 74 行与行衔接，能 log(mn)。240 只保证行内、列内有序，要从边角走。
 *
 * Q: 为什么用闭区间？
 * A: 精确查找，相等立刻返回。左右都可能是答案，left <= right 才不会漏中点。
 */
var searchMatrix = function(matrix, target) {
    let m = matrix.length
    let left = 0; 
    let n = matrix[0].length;
    let right = m * n - 1;
    
    while(left <= right) {
        const mid = Math.floor((left + right ) / 2);
        const val = matrix[Math.floor(mid / n)][mid % n] // 一维下标还原行列：行 = 商，列 = 余
        if(val === target) return true;
        else if(val < target)  left = mid + 1; // 闭区间，mid 已经看过，必须丢掉
        else right = mid - 1;
    }
    return false;
};
