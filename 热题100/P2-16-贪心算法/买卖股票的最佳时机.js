/**
 * @param {number[]} prices
 * @return {number}
 *
 * 思路：
 * 1. 扫一遍，维护迄今最低价。
 * 2. 每天当卖出日，更新最大差价。
 * 3. 边界：最低价初值 Infinity；只交易一次。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 买卖 II：可交易多次，累加所有上涨段。
 * - 含冷冻期 / 手续费：加一个状态。
 * - 最多 k 次：二维 DP。
 *
 * ——— 常见追问 ———
 * Q: 为什么只记迄今最低价？
 * A: 一次交易，最优买入一定是卖出日前的最低点。扫到哪天就把那天当卖出日。
 *
 * Q: 同一天买又卖？
 * A: 差价 0，best 不会涨。等价于没交易。
 *
 * Q: 单调递减？
 * A: 每天差价都 <= 0，best 停在 0。
 *
 * Q: 和买卖 II 差在哪？
 * A: 本题只能一次。II 可以把每一段上涨都吃掉。
 */
var maxProfit = function (prices) {
    let best = 0;
    let minPrice = Infinity; // 用 Infinity 起手：空数组也不会算出 NaN

    for (const price of prices) {
        minPrice = Math.min(minPrice, price);   // ① 买入日自动锁"迄今最便宜"
        best = Math.max(best, price - minPrice); // ② 每天都当卖出日试一遍
    }
    return best;
};
