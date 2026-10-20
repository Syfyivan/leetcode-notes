/**
 * 热题 100 · 两数之和
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 两数之和（LeetCode 1）
 *
 * 给定一个整数数组 nums 和一个目标值 target，在数组中找出和为 target 的两个整数，
 * 返回它们的数组下标。假设每种输入只会对应一个答案，同一个元素不能使用两次。
 *
 * 思路：
 * 1. 扫一遍 nums，把已经见过的数字和下标放进 HashMap。
 * 2. 看到 nums[i] 时查 map 里有没有 target - nums[i]，有就返回两个下标。
 * 3. 边界：同一格不能用两次，先查再写入。题目保证恰好一组答案。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： nums = [2, 7, 11, 15],  target = 9
 * 输出： [0, 1]        （nums[0] + nums[1] === 9）
 *
 * 输入： nums = [3, 2, 4],  target = 6
 * 输出： [1, 2]
 *
 * 输入： nums = [3, 3],  target = 6
 * 输出： [0, 1]
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i); // 先查再写，避免 nums[i] 自己配自己
  }
}

/**
 * 延伸 1：有序数组两数之和（LeetCode 167）
 *
 * 需求：数组已升序，返回两个元素的 1-based 下标，额外空间 O(1)。
 *
 * 思路：左右指针夹逼；和偏小移 left，偏大移 right。
 *
 * ——— 示例 ———
 * 示例：[2,7,11,15]，target=9，输出 [1,2]。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 */
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

/**
 * ——— 常见追问 ———
 * Q: 为什么先查再写入？
 * A: 同一格不能用两次。[3] 配 6 会先查空再写入，不会自己配自己。
 *    [3,3] 配 6 时，第二个 3 能查到第一个，合法。
 *
 * Q: 有多组答案怎么办？
 * A: 题目保证恰好一组。要全部数对就得去重，哈希只能稳找一对。
 *
 * Q: 能先排序再双指针吗？
 * A: 能，但下标会乱。要把原下标一起存。时间变成 O(n log n)。
 *
 * Q: Map 和普通对象怎么选？
 * A: 数字 key 都行。有负数、要区分 1 和 "1" 时用 Map。
 */

// —— 自测 ——
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]

module.exports = { twoSum, twoSumSorted };
