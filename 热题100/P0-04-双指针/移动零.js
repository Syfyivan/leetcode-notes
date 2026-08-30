/**
 * 移动零（LeetCode 283）
 *
 * 给定一个数组 nums，将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 * 必须在不复制数组的情况下原地对数组进行操作。
 *
 * 思路：
 * 1. slow 指向下一个该放非零的位置，fast 从左扫到右。
 * 2. nums[fast] 不是 0，就和 slow 交换，slow++。
 * 3. 边界：全是 0 或没有 0 都不用特判。必须原地，相对顺序不能乱。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： nums = [0, 1, 0, 3, 12]
 * 输出： [1, 3, 12, 0, 0]
 *
 * 输入： nums = [0]
 * 输出： [0]
 *
 * 输入： nums = [1, 2, 3]
 * 输出： [1, 2, 3]
 */

/**
 * @param {number[]} nums
 * @return {number[]}   原地修改 nums，此处返回 nums 便于自测打印
 */
function moveZeroes(nums) {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
  return nums;
}

// —— 自测 ——
console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
console.log(moveZeroes([0]));              // [0]
console.log(moveZeroes([1, 2, 3]));        // [1, 2, 3]

module.exports = { moveZeroes };
