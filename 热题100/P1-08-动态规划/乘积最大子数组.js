// 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

// 测试用例的答案是一个 32-位 整数。
// 请注意，一个只包含一个元素的数组的乘积是这个元素的值。

// 示例 1:
// 输入: nums = [2,3,-2,4]
// 输出: 6
// 解释: 子数组 [2,3] 有最大乘积 6。

/**
 * 思路：
 * 1. 负数会让最大变最小、最小变最大，所以同时维护以 i 结尾的最大乘积和最小乘积。
 * 2. maxF / minF 都从「自己、乘上一段最大、乘上一段最小」里取。
 * 3. 边界：遇到 0 会把连续乘积切断，从当前元素重新开始。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    let maxF = nums[0];   // 以当前元素结尾的最大乘积
    let minF = nums[0];
    let res = nums[0];
    const len = nums.length;

    for(let i = 1; i < len; i++) {
       const x = nums[i];
       const prevMax = maxF, prevMin = minF; // 先拷一份，避免 maxF 改完 minF 用到新值
       maxF = Math.max(x, prevMax * x, prevMin * x);
       minF = Math.min(x, prevMax * x, prevMin * x);
       res = Math.max(res, maxF);
    }
    return res;
};
