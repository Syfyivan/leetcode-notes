/**
 * 移动零（LeetCode 283）
 *
 * 给定一个数组 nums，将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 * 必须在不复制数组的情况下原地对数组进行操作。
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
}

// —— 自测 ——
console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
console.log(moveZeroes([0]));              // [0]
console.log(moveZeroes([1, 2, 3]));        // [1, 2, 3]

module.exports = { moveZeroes };
