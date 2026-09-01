/**
 * 热题 100 · 不同路径
 *
 * 优先级：Hot 100 · P2
 */

/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 *
 * 思路：
 * 1. dp[i][j] 为到达 (i,j) 的路径数，只能从上方或左方来。
 * 2. 第一行第一列只有一条路，初始化为 1。
 * 3. 边界：m 或 n 为 1 时答案就是 1。
 * 复杂度：时间 O(mn)，空间 O(mn)
 *
 * ——— 延伸 ———
 * - 有障碍（LC63）：障碍格 dp 置 0，左边/上边走不到就加 0。
 * - 组合数：一共走 m+n-2 步，选 m-1 步向下，注意溢出。
 * - 滚动数组：一维 dp 从左到右累加，空间 O(n)。
 *
 * ——— 常见追问 ———
 * Q: 为什么第一行第一列是 1？
 * A: 只能一直右或一直下，各只有一条路。fill(1) 正好把边铺好。
 *
 * Q: 只能右和下吗？
 * A: 题目限制。能上左的话会走回头路，DP 转移就环了。
 *
 * Q: m=1 或 n=1？
 * A: 内层循环进不去，直接返回 dp 初值 1。
 *
 * Q: 空间还能压吗？
 * A: dp[j] += dp[j-1]，只要一行。当前格 = 旧上 + 新左。
 */
var uniquePaths = function(m, n) {
    const dp = Array.from({length: m}, () => new Array(n).fill(1)); // 边上只有一条路，fill(1) 顺便初始化

    for(let i = 1; i < m; i++) {
        for(let j = 1; j < n; j++ ) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]; // 只能从上或从左来
        }
    }
    return dp[m - 1][n - 1];
};

/**
 * 延伸 1：组合数学版
 *
 * 需求：机器人总共走 m+n-2 步，从中选择 m-1 步向下。
 *
 * 思路：逐项计算组合数 C(m+n-2, min(m-1,n-1))，避免直接算阶乘。
 *
 * ——— 示例 ———
 * 示例：m=3，n=7，输出 28。
 *
 * 复杂度：时间 O(min(m,n))，空间 O(1)。
 */
function uniquePathsCombinatorial(m, n) {
  const total = m + n - 2;
  const choose = Math.min(m - 1, n - 1);
  let result = 1;
  for (let i = 1; i <= choose; i++) result = result * (total - choose + i) / i;
  return Math.round(result);
}

// —— 自测 ——
console.log(uniquePaths(3, 7)); // 28

module.exports = { uniquePaths, uniquePathsCombinatorial };
