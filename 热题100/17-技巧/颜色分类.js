/**
 * 颜色分类（LeetCode 75）
 *
 * 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums，请原地对它们进行排序，
 * 使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
 * 我们使用整数 0、1 和 2 分别表示红色、白色和蓝色。必须在不使用库内置的 sort 函数的情况下解决这个问题。
 *
 * ——— 示例 ———
 * 输入： nums = [2,0,2,1,1,0]
 * 输出： [0,0,1,1,2,2]
 *
 * 输入： nums = [2,0,1]
 * 输出： [0,1,2]
 */

/**
 * @param {number[]} nums
 * @return {number[]} 原地修改后返回 nums 便于打印
 */
function sortColors(nums) {
}

// —— 自测 ——
console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0,0,1,1,2,2]
console.log(sortColors([2, 0, 1])); // [0,1,2]

module.exports = { sortColors };
