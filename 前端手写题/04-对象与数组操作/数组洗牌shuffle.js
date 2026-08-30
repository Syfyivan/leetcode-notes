/**
 * 数组洗牌 shuffle（Fisher-Yates）
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 shuffle(arr)，等概率打乱数组。
 *   要点：从后往前遍历，每次在 [0, i] 里随机挑一个下标和 i 交换，
 *   这样每种排列出现概率相等（别用 sort(() => Math.random()-0.5)，不均匀）。
 *
 * 思路：
 * 1. 从后往前，i 从 n-1 走到 1。每次在 [0, i] 里随机一个下标，和 i 交换。
 * 2. 每个位置被抽中的概率都是 1/n，排列均匀。
 * 3. 这里原地改原数组，然后把原数组返回。
 * 4. 边界 / 易错：别写成 sort(() => Math.random() - 0.5)，分布不均。
 *
 * ——— 示例 ———
 * 输入： shuffle([1, 2, 3, 4, 5])
 * 输出： 原数组元素的一个随机排列，如 [3, 1, 5, 2, 4]
 *
 * ——— 延伸 ———
 * - 不想改原数组就先 slice 再洗。lodash.shuffle 就是浅拷再洗。
 * - 只要随机抽 k 个：只洗前 k 步然后 slice(0, k)，部分 Fisher-Yates。
 * - Math.random 不够随机时换 crypto.getRandomValues。
 *
 * ——— 常见追问 ———
 * Q: 为什么从后往前？
 * A: i 这个位置从 [0, i] 里抽人换上来，前缀还是未确定区。从前往后也行，区间改成 [i, n)。
 *
 * Q: 为什么是 (i + 1) 不是 i？
 * A: 要包含 i 自己，允许「不换」。写成 i 就永远跟前面换，最后一位永远到不了原位。
 *
 * Q: sort(() => Math.random() - 0.5) 为啥不行？
 * A: 比较函数必须稳定给出正负。随机正负让排序假设崩掉，有的排列概率明显更大。
 *
 * Q: 原地改还是返回新数组？
 * A: 这版原地，面试说清楚。lodash.shuffle 是浅拷再洗。
 */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { // i=0 只剩自己，不用换
    const j = Math.floor(Math.random() * (i + 1)); // [0, i] 闭区间，含 i 自己才能等概率
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

// —— 自测（多次运行结果应不同，且元素齐全）——
console.log(shuffle([1, 2, 3, 4, 5]));

module.exports = { shuffle };
