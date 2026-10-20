/**
 * 搜索插入位置（LeetCode 35）
 *
 * 优先级：Hot 100 · P2
 *
 * 需求：给定一个升序、无重复元素的数组 nums 和目标值 target：
 * 1. target 存在时，返回它的下标。
 * 2. target 不存在时，返回按顺序插入它的位置。
 * 3. 要求时间复杂度为 O(log n)。
 *
 * 思路：
 * 1. 问题等价于寻找第一个大于或等于 target 的位置，也就是 lower_bound。
 * 2. 使用左闭右开区间 [left, right)，所以 right 初始化为 nums.length。
 * 3. nums[middle] < target 时，middle 不可能是答案，令 left = middle + 1。
 * 4. nums[middle] >= target 时，middle 可能是答案，令 right = middle 继续向左查找。
 * 5. 循环结束时 left === right，该位置就是答案，也可能等于 nums.length。
 *
 * ——— 示例 ———
 * 输入：nums = [1,3,5,6], target = 5
 * 输出：2
 *
 * 输入：nums = [1,3,5,6], target = 2
 * 输出：1
 *
 * 复杂度：时间 O(log n)，空间 O(1)
 *
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchInsert(nums, target) {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (nums[middle] < target) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }
  return left;
}

/**
 * 延伸 1：支持对象数组的 lowerBound
 *
 * 需求：数组元素不再是数字，而是对象；调用方通过 key 函数指定用于比较的字段。
 *
 * 思路：
 * 1. 二分框架仍使用左闭右开区间 [left, right)。
 * 2. 比较时把 nums[middle] 替换为 key(array[middle])。
 * 3. 第一个 key(item) >= target 的位置就是插入位置。
 *
 * ——— 示例 ———
 * 输入：array = [{ score: 60 }, { score: 80 }], target = 70
 *      key = item => item.score
 * 输出：1
 *
 * 复杂度：时间 O(log n)，空间 O(1)
 *
 * @template T
 * @param {T[]} array
 * @param {number} target
 * @param {(item: T) => number} [key]
 * @return {number}
 */
function lowerBoundBy(array, target, key = (value) => value) {
  let left = 0;
  let right = array.length;

  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (key(array[middle]) < target) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }
  return left;
}

/**
 * ——— 常见追问 ———
 *
 * Q: target 不存在时，为什么可以直接返回 left？
 * A: 循环结束时，left 左侧都小于 target，left 及其右侧都大于或等于 target，
 *    因此 left 正是保持数组有序的插入位置。
 *
 * Q: 为什么 right 初始化为 nums.length，而不是 nums.length - 1？
 * A: 使用的是左闭右开区间 [left, right)，而且答案可能位于数组末尾的 nums.length。
 *
 * Q: nums 中存在重复值时会返回哪个位置？
 * A: 返回最左侧的 target，因为遇到相等值时仍执行 right = middle，继续向左收缩。
 *
 * Q: 如何改成查找第一个严格大于 target 的位置？
 * A: 改为 nums[middle] <= target 时令 left = middle + 1，其余结构不变，
 *    这就是 upper_bound。
 *
 * Q: 左闭右闭区间可以写吗？
 * A: 可以。把 right 初始化为 nums.length - 1，相等时令 right = middle - 1，
 *    循环使用 left <= right，结束后同样返回 left。两种区间定义不要混用。
 */

// —— 自测 ——
console.log(searchInsert([1, 3, 5, 6], 5)); // 期望：2
console.log(searchInsert([1, 3, 5, 6], 2)); // 期望：1
console.log(searchInsert([1, 3, 5, 6], 7)); // 期望：4
console.log(searchInsert([1, 3, 5, 6], 0)); // 期望：0
console.log(lowerBoundBy([{ score: 60 }, { score: 80 }], 70, (item) => item.score)); // 期望：1

module.exports = { searchInsert, lowerBoundBy };
