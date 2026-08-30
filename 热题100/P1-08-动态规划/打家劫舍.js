/**
 * 思路：
 * 1. dp[i] = 偷到第 i 家为止能拿到的最大金额。
 * 2. 偷这家：dp[i-2] + nums[i]；不偷：dp[i-1]。取较大值。
 * 3. 边界：只有 1 家返回 nums[0]；两家取 max。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length;
    if (n === 1) return nums[0];
    const res = [];
    res[0] = nums[0];
    res[1] = Math.max(nums[0], nums[1]);

    for(let i = 2; i < n; i++) {
        res[i] = Math.max(res[i - 1], res[i - 2] + nums[i]);
    }
    return res[n - 1];
};
