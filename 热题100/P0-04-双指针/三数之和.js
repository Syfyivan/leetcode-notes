/**
 * 热题 100 · 三数之和
 *
 * 优先级：Hot 100 · P0
 */

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
 *
 * ——— 延伸 ———
 * - 四数之和：再套一层枚举，剩下双指针，每层都去重。
 * - 最接近的三数之和：记下和与 target 的差，不必找全。
 * - 三数之和为 target：把 0 换成 target，判断改成 sum 和 target 比。
 *
 * ——— 常见追问 ———
 * Q: 为什么要先排序？
 * A: 双指针靠有序才知道该 L++ 还是 R--。相同值挤在一起，去重也方便。
 *
 * Q: nums[i] > 0 为什么能 break？
 * A: 有序，后面全是更大的正数，三数之和必大于 0。
 *
 * Q: 去重为什么跟 i-1 比，不跟 i+1 比？
 * A: 同一层只留第一次出现的 nums[i]。跟前一个比，说明这值已经当过第一数了。
 *
 * Q: 找到一组后 L、R 都要动？
 * A: 是。只动一边，和还是 0，会收下重复三元组。先跳相同值再各走一步。
 *
 * Q: sort 为什么写 (a, b) => a - b？
 * A: 默认按字符串排，[-1, -2] 会乱。必须数值比较。
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  nums.sort((a, b) => a - b); // 数值比较；默认字典序会把负数排乱
  const res = [];
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) break; // 有序，后面全正，和不可能再是 0
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

/**
 * 延伸 1：三数之和为任意 target
 *
 * 需求：返回所有不重复三元组，使三数之和等于 target。
 *
 * 思路：排序后枚举第一个数，剩余区间双指针夹逼；三层位置都跳过重复值。
 *
 * ——— 示例 ———
 * 示例：[1,2,-2,-1,0]，target=0，输出 [[-2,0,2],[-1,0,1]]。
 *
 * 复杂度：时间 O(n²)，排序额外空间视实现而定。
 */
function threeSumTarget(nums, target) {
  const sorted = nums.slice().sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let left = i + 1;
    let right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum === target) {
        result.push([sorted[i], sorted[left], sorted[right]]);
        while (left < right && sorted[left] === sorted[++left]);
        while (left < right && sorted[right] === sorted[--right]);
      } else if (sum < target) left++;
      else right--;
    }
  }
  return result;
}

// —— 自测 ——
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1, -1, 2], [-1, 0, 1]]
console.log(threeSum([0, 1, 1]));             // []
console.log(threeSum([0, 0, 0]));             // [[0, 0, 0]]

module.exports = { threeSum, threeSumTarget };
