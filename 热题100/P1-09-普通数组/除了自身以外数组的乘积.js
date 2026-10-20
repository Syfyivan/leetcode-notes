/**
 * 热题 100 · 除了自身以外数组的乘积
 *
 * 优先级：Hot 100 · P1
 */

// 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除了 nums[i] 之外其余各元素的乘积 。

// 题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

// 请 不要使用除法，且在 O(n) 时间复杂度内完成此题。



// 示例 1:

// 输入: nums = [1,2,3,4]
// 输出: [24,12,8,6]
// 示例 2:

// 输入: nums = [-1,1,0,-3,3]
// 输出: [0,0,9,0,0]

/**
 * 思路：
 * 1. answer[i] = 左边所有数的积 * 右边所有数的积。
 * 2. 先从左扫出前缀积，再从右扫出后缀积，对应位相乘。
 * 3. 边界：不能用除法，数组里可能有 0。prefix[0] 和 suffix[n-1] 是 1。
 * 复杂度：时间 O(n)，空间 O(n)

 *
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    // const map = new Map();
    const res = [];
    const prefix = [1]; // 左边空积约定为 1
     const len = nums.length;
    const suffix = Array(len).fill(1)
    for(let i = 1; i < len; i++) {
        prefix[i] = prefix[i - 1] * nums[i - 1];
    }
    for(let j = len - 2; j >= 0; j--) {
        suffix[j] = suffix[j + 1] * nums[j + 1];
        res[j] = suffix[j] * prefix[j]
    }
    res[len - 1] = suffix[len - 1] * prefix[len - 1]; // 后缀循环没覆盖最后一位
    return res;
};

/**
 * 延伸 1：允许除法时处理零
 *
 * 需求：用总乘积解题，但必须正确处理数组中 0 的数量。
 *
 * 思路：两个以上 0 时全为 0；一个 0 时只有该位置等于非零项乘积；没有 0 才做除法。
 *
 * ——— 示例 ———
 * 示例：[1,2,0,4] 输出 [0,0,8,0]。
 *
 * 复杂度：时间 O(n)，除结果数组外空间 O(1)。
 */
function productExceptSelfWithDivision(nums) {
  let product = 1;
  let zeroCount = 0;
  for (const value of nums) {
    if (value === 0) zeroCount++;
    else product *= value;
  }
  if (zeroCount > 1) return new Array(nums.length).fill(0);
  return nums.map((value) => {
    if (zeroCount === 1) return value === 0 ? product : 0;
    return product / value;
  });
}

/**
 * ——— 常见追问 ———
 * Q: 为什么不能除法？
 * A: 题目禁用。有 0 时除法还要特判。前缀后缀不踩这个坑。
 *
 * Q: prefix[0] = 1？
 * A: 左边没有元素，乘积约定为 1。否则 nums[0] 的答案会乘上一个不存在的数。
 *
 * Q: 为什么最后单独写 res[len-1]？
 * A: 后缀循环从 len-2 起，最后一个位置没进循环。suffix[len-1] 已经是 1。
 *
 * Q: 有 0 怎么办？
 * A: 0 所在位置前缀/后缀会变成 0。只有一个 0 时，它自己的答案是其余积，别的位置都是 0。
 */

// —— 自测 ——
console.log(productExceptSelf([1, 2, 3, 4])); // [24,12,8,6]

module.exports = { productExceptSelf, productExceptSelfWithDivision };
