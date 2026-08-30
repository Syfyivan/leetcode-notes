/**
 * 下一个排列（LeetCode 31）
 *
 * 整数数组的一个排列就是将其所有成员以序列或线性顺序排列。
 * 整数数组的下一个排列是指其整数的下一个字典序更大的排列。如果不存在下一个更大的排列，
 * 则将数组重新排列成字典序最小的排列（即升序排列）。
 * 必须原地修改，只允许使用额外常数空间。
 *
 * ——— 示例 ———
 * 输入： nums = [1,2,3]
 * 输出： [1,3,2]
 *
 * 输入： nums = [3,2,1]
 * 输出： [1,2,3]
 *
 * 输入： nums = [1,1,5]
 * 输出： [1,5,1]
 *
 * 思路：
 * 1. 从右找第一个下降点 i（nums[i] < nums[i+1]）。
 * 2. 再从右找第一个 > nums[i] 的 j，交换后把 i+1 到末尾反转。
 * 3. 边界：整个数组降序则直接反转成升序。
 * 复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {number[]} nums
 * @return {number[]} 原地修改后返回 nums 便于打印
 */
function nextPermutation(nums) {
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--; // 找第一个变小的
    if (i >= 0) {
        let j = nums.length - 1;
        while (nums[j] <= nums[i]) j--; // 右侧刚好比 nums[i] 大的
        const t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }
    let l = i + 1;
    let r = nums.length - 1;
    while (l < r) {
        const t = nums[l];
        nums[l] = nums[r];
        nums[r] = t;
        l++;
        r--;
    }
    return nums;
}

// —— 自测 ——
console.log(nextPermutation([1, 2, 3])); // [1,3,2]
console.log(nextPermutation([3, 2, 1])); // [1,2,3]
console.log(nextPermutation([1, 1, 5])); // [1,5,1]

module.exports = { nextPermutation };
