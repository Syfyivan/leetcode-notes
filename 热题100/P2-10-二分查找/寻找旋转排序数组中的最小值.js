/**
 * 热题 100 · 寻找旋转排序数组中的最小值
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 寻找旋转排序数组中的最小值（LC153）
 *
 * 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。
 * 例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
 * 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]；若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]。
 * 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。
 * 请你找出并返回数组中的 最小元素 。
 *
 * 进阶：你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
 *
 * ——— 示例 ———
 * 输入： nums = [3,4,5,1,2]
 * 输出： 1
 *
 * 输入： nums = [4,5,6,7,0,1,2]
 * 输出： 0
 *
 * 输入： nums = [11,13,15,17]
 * 输出： 11
 *
 * 思路：
 * 1. 最小值在旋转断点。拿 nums[mid] 和 nums[right] 比。
 * 2. mid 落在左段（nums[mid] > nums[right]）则断点在右侧，left = mid + 1。
 * 3. 边界：nums[mid] < nums[right] 时 mid 可能就是最小，right = mid，不能 mid-1。
 * 复杂度：时间 O(log n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 有重复（LC154）：nums[mid] == nums[right] 时 right--，最坏退到 O(n)。
 * - 最小值下标就是旋转次数。
 * - 先找最小再普通二分：搜索旋转数组的另一种写法。
 *
 * ——— 常见追问 ———
 * Q: 为什么跟 right 比，不跟 left 比？
 * A: 没旋转时 left 就是最小，nums[mid] > nums[left] 会误判整段有序。跟右端比能分清「断点在右」还是「mid 已在右段」。
 *
 * Q: 为什么 right = mid 不能减 1？
 * A: mid 可能正好是最小值。减 1 会把答案扔出去。
 *
 * Q: 没旋转呢？
 * A: 全程 nums[mid] < nums[right]，right 一直缩到 left，停在 0。
 *
 * Q: 循环条件为什么是 left < right？
 * A: 退出时 left == right，指向唯一剩下的最小值。写成 <= 还要单独处理重合。
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
function findMin(nums) {
    let left = 0;
    let right = nums.length - 1;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] > nums[right]) {
            left = mid + 1; // mid 在较大那段，最小在 mid 右边
        } else {
            right = mid; // mid 可能就是最小
        }
    }
    return nums[left];
}

/**
 * 延伸 1：允许重复元素（LeetCode 154）
 *
 * 需求：旋转数组中可出现重复值，返回最小值。
 *
 * 思路：mid 小于 right 时最小值在左侧；大于时在右侧；相等时只能安全地 right--。
 *
 * ——— 示例 ———
 * 示例：[2,2,2,0,1] 输出 0。
 *
 * 复杂度：平均 O(log n)，全重复时 O(n)。
 */
function findMinWithDuplicates(nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (nums[middle] < nums[right]) right = middle;
    else if (nums[middle] > nums[right]) left = middle + 1;
    else right--;
  }
  return nums[left];
}

// —— 自测 ——
console.log(findMin([3, 4, 5, 1, 2])); // 期望输出 1
console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 期望输出 0
console.log(findMin([11, 13, 15, 17])); // 期望输出 11

module.exports = { findMin, findMinWithDuplicates };
