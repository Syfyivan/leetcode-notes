/**
 * 热题 100 · 缺失的第一个正数
 *
 * 优先级：Hot 100 · P1
 */

/**
 * 缺失的第一个正数（LeetCode 41）
 *
 * 给定一个未排序的整数数组 nums，请找出其中没有出现的最小的正整数。
 * 请实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
 *
 * 思路：
 * 1. 答案一定在 [1, n+1] 里。把值为 x 的数放到下标 x-1 上，原地哈希。
 * 2. 再扫一遍，第一个 nums[i] !== i+1 的位置，答案就是 i+1。
 * 3. 边界：全在位则答案是 n+1。交换时若目标位已经是 x，要停，否则死循环。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： nums = [1, 2, 0]
 * 输出： 3        （范围 [1, 2] 都出现了，缺失的最小正数是 3）
 *
 * 输入： nums = [3, 4, -1, 1]
 * 输出： 2        （1 在数组中，2 没有出现）
 *
 * 输入： nums = [7, 8, 9, 11, 12]
 * 输出： 1        （最小的正数 1 没有出现）
 *
 * ——— 延伸 ———
 * - 允许 O(n) 空间：Set 存一遍，从 1 扫到 n+1。
 * - 找缺失的 k 个正数：原地哈希后收集。
 * - 第一个缺失的非负：答案范围改成 [0, n]。
 *
 * ——— 常见追问 ———
 * Q: 答案为什么在 [1, n+1]？
 * A: n 个数最多装下 1..n。缺哪个就是它；全在就 n+1。
 *
 * Q: 为什么目标位已是 x 要停？
 * A: [1,1] 两个 1 会来回换，死循环。已经就位就别换。
 *
 * Q: 负数和 > n 的数？
 * A: 不可能是答案候选位置上的正确值，留着不动。最后扫到它们就说明该位缺失。
 *
 * Q: 能用布尔数组吗？
 * A: 能，空间 O(n)。题目要求常数空间，所以挤回原数组。
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (
      nums[i] > 0 &&
      nums[i] <= n &&
      nums[nums[i] - 1] !== nums[i] // 目标位已是 x 就停，避免重复值死循环
    ) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}

/**
 * 延伸 1：Set 基准版
 *
 * 需求：不修改输入，用额外空间写出易核对的答案。
 *
 * 思路：所有正数放入 Set，从 1 起找到第一个不存在的数。
 *
 * ——— 示例 ———
 * 示例：[3,4,-1,1] 输出 2。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function firstMissingPositiveWithSet(nums) {
  const values = new Set(nums);
  for (let candidate = 1; candidate <= nums.length + 1; candidate++) {
    if (!values.has(candidate)) return candidate;
  }
}

// —— 自测 ——
console.log(firstMissingPositive([1, 2, 0]));           // 3
console.log(firstMissingPositive([3, 4, -1, 1]));       // 2
console.log(firstMissingPositive([7, 8, 9, 11, 12]));   // 1

module.exports = { firstMissingPositive, firstMissingPositiveWithSet };
