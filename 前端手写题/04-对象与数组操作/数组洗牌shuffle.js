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

/**
 * 延伸 1：不修改原数组，并允许注入随机源
 *
 * 需求：返回新数组；测试时可传固定 random，得到可复现结果。
 *
 * 思路：先 slice 浅拷，再做同一套 Fisher-Yates。random 默认 Math.random。
 *
 * ——— 示例 ———
 * 输入：shuffleCopy([1,2,3], () => 0)
 * 输出：结果固定，且原数组仍是 [1,2,3]
 */
function shuffleCopy(arr, random = Math.random) {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 延伸 2：等概率随机抽 k 项
 *
 * 需求：不必洗完整个数组，只返回不重复的 k 个随机元素。
 *
 * 思路：改用从前往后的 Fisher-Yates。第 i 轮从 [i, n) 抽一项换到 i，
 * 只做 k 轮后取前 k 项，复杂度从 O(n) 降到 O(k) 次交换。
 *
 * ——— 示例 ———
 * 输入：sample([1,2,3,4,5], 2)
 * 输出：任意两个不重复元素
 */
function sample(arr, k, random = Math.random) {
  if (!Number.isInteger(k) || k < 0 || k > arr.length) {
    throw new RangeError('k 必须是 0 到数组长度之间的整数');
  }
  const result = arr.slice();
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(random() * (result.length - i));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, k);
}

// —— 自测（多次运行结果应不同，且元素齐全）——
console.log(shuffle([1, 2, 3, 4, 5]));

module.exports = { shuffle, shuffleCopy, sample };
