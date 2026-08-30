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

// —— 自测 ——
console.log(findMin([3, 4, 5, 1, 2])); // 期望输出 1
console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 期望输出 0
console.log(findMin([11, 13, 15, 17])); // 期望输出 11

module.exports = { findMin };
