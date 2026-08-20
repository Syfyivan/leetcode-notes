/**
 * 滑动窗口最大值（LeetCode 239）
 *
 * 给定一个整数数组 nums，有一个大小为 k 的窗口从数组最左侧移动到最右侧，每次只向右移动一位。
 * 你只可以看到窗口内的 k 个数字，返回每次窗口滑动时窗口中的最大值组成的数组。
 *
 * ——— 示例 ———
 * 输入： nums = [1, 3, -1, -3, 5, 3, 6, 7],  k = 3
 * 输出： [3, 3, 5, 5, 6, 7]
 *
 * 输入： nums = [1],  k = 1
 * 输出： [1]
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
}

// —— 自测 ——
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3, 3, 5, 5, 6, 7]
console.log(maxSlidingWindow([1], 1));                        // [1]

module.exports = { maxSlidingWindow };
