/**
 * 思路：
 * 1. dp[i] = 凑出金额 i 的最少硬币数。
 * 2. 枚举硬币 c，若 i >= c，dp[i] = min(dp[i], dp[i-c] + 1)。硬币可重复用，完全背包。
 * 3. 边界：dp[0]=0，其余先填 Infinity。凑不出返回 -1。
 * 复杂度：时间 O(amount * |coins|)，空间 O(amount)
 *
 * ——— 延伸 ———
 * - 零钱兑换 II：求组合数，外层硬币内层金额，避免排列重复。
 * - 必须用恰好 k 枚：再加一维枚举用了几枚。
 * - 有限张数（多重背包）：二进制拆分或单调队列优化。
 *
 * ——— 常见追问 ———
 * Q: 为什么完全背包？
 * A: 每种硬币无限枚。金额从小到大，dp[i - c] 已经含当前硬币。
 *
 * Q: 凑不出返回 -1？
 * A: dp[amount] 还是 Infinity。不要把 Infinity 丢给调用方。
 *
 * Q: 先循环硬币还是金额？
 * A: 求最少枚数两种都行。求组合数必须先硬币，否则会把排列都算上。
 *
 * Q: coins 有 0 / 负数？
 * A: 题目正整数。0 会死循环，要先过滤。
 *
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 凑 0 用 0 枚，否则 min 没有起点

    for(let i = 1; i <= amount; i++) {
        for(let j = 0; j < coins.length; j++) {
            if(i - coins[j] >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount]; // 凑不出别把 Infinity 丢出去
};
