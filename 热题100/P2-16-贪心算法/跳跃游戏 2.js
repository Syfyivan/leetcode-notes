/**
 * 给定一个长度为 n 的 0 索引整数数组 nums。初始位置在下标 0。
每个元素 nums[i] 表示从索引 i 向后跳转的最大长度。换句话说，如果你在索引 i 处，你可以跳转到任意 (i + j) 处：
0 <= j <= nums[i] 且 i + j < n
返回到达 n - 1 的最小跳跃次数。测试用例保证可以到达 n - 1。

输入: nums = [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
 * 思路：
 * 1. 贪心：在当前这一跳的覆盖范围内，找下一跳能到的最远。
 * 2. i 走到当前覆盖右端就 jumps++，更新覆盖。
 * 3. 边界：循环到 n-2，站在终点不再跳。
 * 复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {
    let max = 0;
    const len = nums.length;
    let count = 0;
    let curEnd = 0;

    for(let i = 0; i < len - 1; i++) { // 不到最后一个下标，避免多跳一次
        max = Math.max(max, i + nums[i]);
        if(i === curEnd) {
            count++;
            curEnd = max;
        }
    }
    return count;
};
