/**
 * 热题 100 · 完全平方数
 *
 * 优先级：Hot 100 · P1
 */

/**
 * 思路：
 * 1. 和零钱兑换同构，物品换成 1、4、9... 这些完全平方数，可重复用。
 * 2. dp[i] = 凑出 i 的最少个数，dp[i] = min(dp[i - j*j] + 1)。
 * 3. 边界：dp[0]=0。n=1 返回 1。
 * 复杂度：时间 O(n * sqrt(n))，空间 O(n)
 *
 * ——— 延伸 ———
 * - 四平方定理：任意自然数最多 4 个平方数，可 O(sqrt n) 特判。
 * - 平方数之和（LC 633）：双指针或费马平方和。
 * - 和爬楼梯同构：每次跨完全平方步。
 *
 * ——— 常见追问 ———
 * Q: 为什么和零钱兑换同构？
 * A: 硬币面额换成 1、4、9...，可重复用，求最少个数。
 *
 * Q: dp 初始 Infinity？
 * A: 还没凑出。min 才能被更新。dp[0] = 0 是起点。
 *
 * Q: j * j <= i？
 * A: 只用不超过 i 的平方数。j 从 1 扫到 sqrt(i)。
 *
 * Q: n = 0？
 * A: 题目 n >= 1。按代码 dp[0] = 0。
 *
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0; // 凑 0 用 0 个平方数，后面 min 才有起点
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1); // 完全背包：每个平方数可重复用
        }
    }
    return dp[n];
};

/**
 * 延伸 1：BFS 最短路径版
 *
 * 需求：把每个剩余值看成节点，每次减一个平方数，最少层数就是答案。
 *
 * 思路：从 n 开始逐层扩展 n-square；第一次到 0 时返回当前层数，Set 去重。
 *
 * ——— 示例 ———
 * 示例：n=12 输出 3（4+4+4）。
 *
 * 复杂度：时间约 O(n√n)，空间 O(n)。
 */
function numSquaresBFS(n) {
  const squares = [];
  for (let value = 1; value * value <= n; value++) squares.push(value * value);
  const queue = [n];
  const seen = new Set([n]);
  let head = 0;
  let steps = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    steps++;
    for (let i = 0; i < size; i++) {
      const current = queue[head++];
      for (const square of squares) {
        if (square > current) break;
        const next = current - square;
        if (next === 0) return steps;
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
  }
  return 0;
}

// —— 自测 ——
console.log(numSquares(12)); // 3

module.exports = { numSquares, numSquaresBFS };
