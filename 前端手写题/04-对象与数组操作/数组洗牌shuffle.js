/**
 * 数组洗牌 shuffle（Fisher-Yates）
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 shuffle(arr)，等概率打乱数组。
 *   要点：从后往前遍历，每次在 [0, i] 里随机挑一个下标和 i 交换，
 *   这样每种排列出现概率相等（别用 sort(() => Math.random()-0.5)，不均匀）。
 *
 * ——— 示例 ———
 * 输入： shuffle([1, 2, 3, 4, 5])
 * 输出： 原数组元素的一个随机排列，如 [3, 1, 5, 2, 4]
 */

function shuffle() {
}

// —— 自测（多次运行结果应不同，且元素齐全）——
console.log(shuffle([1, 2, 3, 4, 5]));

module.exports = { shuffle };
