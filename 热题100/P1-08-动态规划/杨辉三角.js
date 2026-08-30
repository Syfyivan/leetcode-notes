/**
 * 思路：
 * 1. 第 i 行有 i+1 个数，两端是 1。
 * 2. 中间 res[i][j] = res[i-1][j-1] + res[i-1][j]。
 * 3. 边界：numRows=1 只返回 [[1]]，别预先写好第二行。
 * 复杂度：时间 O(numRows^2)，空间 O(numRows^2)
 *
 * ——— 延伸 ———
 * - 杨辉三角 II：只要第 n 行，滚动数组或组合数 C(n, k)。
 * - 空间 O(n)：一行滚动，从右往左加，避免覆盖。
 * - 模质数的组合数：卢卡斯 / 预处理阶乘逆元。
 *
 * ——— 常见追问 ———
 * Q: 为什么两端先写 1？
 * A: C(i, 0) = C(i, i) = 1。中间才用上一行相加。
 *
 * Q: j 从 1 到 i-1？
 * A: 两端已经填好。i = 0、1 时内层循环不进。
 *
 * Q: 和组合数的关系？
 * A: 第 i 行第 j 个是 C(i, j)。递推 C(i, j) = C(i-1, j-1) + C(i-1, j)。
 *
 * Q: 溢出？
 * A: JS Number 到第 30 行左右还行，再大用 BigInt。题目 numRows 通常 <= 30。
 *
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const res = [];
    for(let i = 0; i < numRows; i++) {
        res[i] = [];
        res[i][0] = 1;
        res[i][i] = 1; // 两端 C(i,0)/C(i,i)，i=0 时两个下标重合
        for(let j = 1; j < i; j++) {
            res[i][j] = res[i - 1][j -1] + res[i - 1][j]; // C(i,j) = C(i-1,j-1) + C(i-1,j)
        }
    }
    return res;
};
