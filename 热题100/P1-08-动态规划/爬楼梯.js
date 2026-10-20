/**
 * 热题 100 · 爬楼梯
 *
 * 优先级：Hot 100 · P1
 */

/**
 * 思路：
 * 1. dp[i] = 爬到第 i 阶的方法数，最后一步只能跨 1 阶或 2 阶。
 * 2. dp[i] = dp[i-1] + dp[i-2]。dp[0]=1，dp[1]=1。
 * 3. 边界：n=1 直接返回 1。
 * 复杂度：时间 O(n)，空间 O(n)

 *
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    const dp = [];
    dp[0] = 1; // 地面一种空方案，dp[2] 才能得到 2
    dp[1] = 1;

    for(let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]; // 最后一步跨 1 或 2
    }
    return dp[n];
};

/**
 * 延伸 1：每次可走任意给定步数
 *
 * 需求：steps 例如 [1,2,3]，计算到第 n 阶的有序走法数。
 *
 * 思路：dp[i] 汇总所有合法 step 对应的 dp[i-step]；先后顺序不同算不同走法。
 *
 * ——— 示例 ———
 * 示例：n=4，steps=[1,2]，输出 5。
 *
 * 复杂度：时间 O(n*steps.length)，空间 O(n)。
 */
function climbStairsWithSteps(n, steps = [1, 2]) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let floor = 1; floor <= n; floor++) {
    for (const step of steps) if (floor >= step) dp[floor] += dp[floor - step];
  }
  return dp[n];
}

/**
 * ——— 常见追问 ———
 * Q: dp[0] = 1 是什么意思？
 * A: 站在地面，一种「什么都不做」的方案。这样 dp[2] = dp[1] + dp[0] = 2。
 *
 * Q: 和斐波那契差在哪？
 * A: 就是斐波那契，下标偏移：F(n+1)。n = 1 返回 1，n = 2 返回 2。
 *
 * Q: 能递归吗？
 * A: 能，但要记忆化，否则指数爆炸。
 *
 * Q: 模 1e9+7？
 * A: 进阶版会要求。每次加完取模。
 */

// —— 自测 ——
console.log(climbStairs(5)); // 8

module.exports = { climbStairs, climbStairsWithSteps };
