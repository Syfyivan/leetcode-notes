/**
 * 寻找重复数（LeetCode 287）
 *
 * 给定一个包含 n + 1 个整数的数组 nums，其数字都在 [1, n] 范围内（包括 1 和 n），
 * 可知至少存在一个重复的整数。假设 nums 只有一个重复的整数，返回这个重复的数。
 * 你设计的解决方案必须不修改数组 nums 且只用常量级 O(1) 的额外空间。
 *
 * ——— 示例 ———
 * 输入： nums = [1,3,4,2,2]
 * 输出： 2
 *
 * 输入： nums = [3,1,3,4,2]
 * 输出： 3
 *
 * 输入： nums = [3,3,3,3,3]
 * 输出： 3
 *
 * 思路：
 * 1. 下标到值看成链表，重复数是环入口。
 * 2. 快慢指针相遇后，慢指针回起点再同步走，交点即入口。
 * 3. 边界：值域是 [1,n]，不会走到 0 以外的死路。
 * 复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function findDuplicate(nums) {
    let slow = nums[0];
    let fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    slow = nums[0]; // 相遇后再从起点走，第二次相遇是环入口
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}

// —— 自测 ——
console.log(findDuplicate([1, 3, 4, 2, 2])); // 2
console.log(findDuplicate([3, 1, 3, 4, 2])); // 3
console.log(findDuplicate([3, 3, 3, 3, 3])); // 3

module.exports = { findDuplicate };
