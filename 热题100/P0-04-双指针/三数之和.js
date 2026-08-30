/**
 * 三数之和（LeetCode 15）
 *
 * 给定一个整数数组 nums，返回所有满足 i != j、i != k、j != k，
 * 且 nums[i] + nums[j] + nums[k] === 0 的三元组。
 * 答案中不可包含重复的三元组，三元组的顺序和三元组内元素的顺序均不作要求。
 *
 * 思路：
 * 1. 先排序。枚举第一个数 nums[i]，剩下两个用左右指针找相反数。
 * 2. 和大于 0 就 R--，小于 0 就 L++，等于 0 收一组，L、R 再跳过重复值。
 * 3. 边界：nums[i] > 0 后面全是正数，直接停。i 也要跳过重复，避免重复三元组。
 * 复杂度：时间 O(n^2)，空间 O(1) 不计答案数组
 *
 * ——— 示例 ———
 * 输入： nums = [-1, 0, 1, 2, -1, -4]
 * 输出： [[-1, -1, 2], [-1, 0, 1]]
 *
 * 输入： nums = [0, 1, 1]
 * 输出： []
 *
 * 输入： nums = [0, 0, 0]
 * 输出： [[0, 0, 0]]
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue; // 第一个数去重
    let L = i + 1;
    let R = n - 1;
    while (L < R) {
      const sum = nums[i] + nums[L] + nums[R];
      if (sum === 0) {
        res.push([nums[i], nums[L], nums[R]]);
        while (L < R && nums[L] === nums[L + 1]) L++; // 左右指针去重
        while (L < R && nums[R] === nums[R - 1]) R--;
        L++;
        R--;
      } else if (sum < 0) {
        L++;
      } else {
        R--;
      }
    }
  }
  return res;
}

// —— 自测 ——
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1, -1, 2], [-1, 0, 1]]
console.log(threeSum([0, 1, 1]));             // []
console.log(threeSum([0, 0, 0]));             // [[0, 0, 0]]

module.exports = { threeSum };
