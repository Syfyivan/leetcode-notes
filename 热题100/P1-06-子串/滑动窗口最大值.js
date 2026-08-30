/**
 * 滑动窗口最大值（LeetCode 239）
 *
 * 给定一个整数数组 nums，有一个大小为 k 的窗口从数组最左侧移动到最右侧，每次只向右移动一位。
 * 你只可以看到窗口内的 k 个数字，返回每次窗口滑动时窗口中的最大值组成的数组。
 *
 * 思路：
 * 1. 单调队列存下标，队头到队尾对应的值递减，队头就是当前窗口最大值。
 * 2. 新来的数把队尾所有更小的弹掉再入队。队头下标滑出窗口就弹出。
 * 3. 边界：k = 1 时答案就是原数组本身。
 * 复杂度：时间 O(n)，空间 O(k)
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
  const q = []; // 存下标，对应值单调递减
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();
    q.push(i);
    if (q[0] <= i - k) q.shift(); // 队头滑出窗口
    if (i >= k - 1) res.push(nums[q[0]]);
  }
  return res;
}

// —— 自测 ——
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3, 3, 5, 5, 6, 7]
console.log(maxSlidingWindow([1], 1));                        // [1]

module.exports = { maxSlidingWindow };
