/**
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
如果数组中不存在目标值 target，返回 [-1, -1]。
你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
    // lower_bound：返回第一个 >= num 的下标（就是 35 的模板，一字不改）
    const find = (num) => {
        let left = 0;
        let right = nums.length; // 左闭右开
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (nums[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    };

    const start = find(target); // 第一个 >= target = 第一个 target（若存在）
    // 顺序关键：先判越界，靠 || 短路，避免访问越界的 nums[start]
    if (start === nums.length || nums[start] !== target) return [-1, -1];
    const end = find(target + 1) - 1; // (第一个 >= target+1) - 1 = 最后一个 target
    return [start, end];
};
