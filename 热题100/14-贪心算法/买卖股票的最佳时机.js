/**
 * @param {number[]} prices
 * @return {number}
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
