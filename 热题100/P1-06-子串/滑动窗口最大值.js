/**
 * 热题 100 · 滑动窗口最大值
 *
 * 优先级：Hot 100 · P1
 */

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
    while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop(); // 旧的更小或同大，活不过新来的
    q.push(i);
    if (q[0] <= i - k) q.shift(); // 队头滑出窗口
    if (i >= k - 1) res.push(nums[q[0]]);
  }
  return res;
}

/**
 * 延伸 1：滑动窗口最小值
 *
 * 需求：每个长度为 k 的窗口返回最小值。
 *
 * 思路：维护单调递增的下标队列；队头过期就移除，新值更小则弹掉队尾。
 *
 * ——— 示例 ———
 * 示例：[1,3,-1,-3,5,3,6,7]，k=3，输出 [-1,-3,-3,-3,3,3]。
 *
 * 复杂度：时间 O(n)，空间 O(k)。
 */
function minSlidingWindow(nums, k) {
  if (k <= 0 || k > nums.length) return [];
  const result = [];
  const deque = [];
  let head = 0;
  for (let i = 0; i < nums.length; i++) {
    while (head < deque.length && deque[head] <= i - k) head++;
    while (deque.length > head && nums[deque.at(-1)] >= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[head]]);
  }
  return result;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么存下标不存值？
 * A: 要判断队头有没有滑出窗口。只存值不知道它的位置。
 *
 * Q: 为什么弹 <= 而不是 <？
 * A: 相等的旧值没资格留着。新来的更靠右、活得更久，留旧的只会更早过期。
 *
 * Q: 为什么用双端队列？
 * A: 队尾弹出更小的，队头弹出过期的。两端都要操作，栈做不到。
 *
 * Q: k = 1、k = n？
 * A: k = 1 每次窗口就一个数。k = n 答案只有一个全局 max。
 */

// —— 自测 ——
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3, 3, 5, 5, 6, 7]
console.log(maxSlidingWindow([1], 1));                        // [1]

module.exports = { maxSlidingWindow, minSlidingWindow };
