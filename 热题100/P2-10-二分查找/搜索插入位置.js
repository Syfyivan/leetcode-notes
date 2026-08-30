/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 *
 * 思路：
 * 1. 找第一个 >= target 的下标，即 lower_bound。
 * 2. 区间 [left, right) 左闭右开，right 取 nums.length。
 * 3. 边界：nums[mid] < target 才 left = mid + 1，相等时 right = mid 继续往左。
 * 复杂度：时间 O(log n)，空间 O(1)
 */
var searchInsert = function(nums, target) {
    let left = 0;
    let right = nums.length; // 左闭右开，right 允许取到 n

    while(left < right) {
        let mid = Math.floor((left + right) / 2)
        if(nums[mid] < target) {
            left = mid + 1;
        }
        else {
            right = mid; // 不能 mid-1，mid 可能就是插入位
        }
    }
    return left
};
