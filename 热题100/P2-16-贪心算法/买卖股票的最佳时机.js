/**
 * @param {number[]} prices
 * @return {number}
 *
 * 思路：
 * 1. 扫一遍，维护迄今最低价。
 * 2. 每天当卖出日，更新最大差价。
 * 3. 边界：最低价初值 Infinity；只交易一次。
 * 复杂度：时间 O(n)，空间 O(1)
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
