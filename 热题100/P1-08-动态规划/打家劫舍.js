/**
 * 思路：
 * 1. dp[i] = 偷到第 i 家为止能拿到的最大金额。
 * 2. 偷这家：dp[i-2] + nums[i]；不偷：dp[i-1]。取较大值。
 * 3. 边界：只有 1 家返回 nums[0]；两家取 max。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 延伸 ———
 * - 打家劫舍 II：首尾相邻，拆成「偷第一不偷最后」和反过来，取 max。
 * - 打家劫舍 III：树形 DP，每个节点返回 [偷, 不偷]。
 * - 空间 O(1)：只留 prev2、prev1 两个变量。
 *
 * ——— 常见追问 ———
 * Q: 为什么 max(不偷, 偷)？
 * A: 相邻不能同时偷。不偷继承 i-1；偷就只能加到 i-2。
 *
 * Q: 只有一家？
 * A: 直接返回 nums[0]。后面 res[1] 会越界。
 *
 * Q: 全是 0 / 有负数？
 * A: 题目金额非负。有负数当 0 处理（不偷）。
 *
 * Q: 和爬楼梯像不像？
 * A: 都是看前两格。爬楼梯是加，这里是 max。
 *
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length;
    if (n === 1) return nums[0]; // 否则 res[1] 越界
    const res = [];
    res[0] = nums[0];
    res[1] = Math.max(nums[0], nums[1]);

    for(let i = 2; i < n; i++) {
        res[i] = Math.max(res[i - 1], res[i - 2] + nums[i]); // 不偷继承 i-1；偷则只能加到 i-2
    }
    return res[n - 1];
};
