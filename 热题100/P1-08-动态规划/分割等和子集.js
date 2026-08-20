// 给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。


// 输入：nums = [1,5,11,5]
// 输出：true
// 解释：数组可以分割成 [1, 5, 5] 和 [11] 。
// 1 1 2 2
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
    const dp = [];
    const sum = nums.reduce((a, b) => a + b, 0 );
    if(sum % 2 != 0) return false;

    const target = sum / 2;
    

};