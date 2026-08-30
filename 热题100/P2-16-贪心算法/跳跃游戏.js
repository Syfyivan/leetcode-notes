/**给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标，如果可以，返回 true ；否则，返回 false 。

 

示例 1：

输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
示例 2：

输入：nums = [3,2,1,0,4]
输出：false
解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。

思路：
1. 维护能到达的最远下标 max。
2. 只有 i <= max 才能从 i 起跳，更新 max。
3. 边界：max 覆盖末尾即 true；出现 i > max 则到不了。
复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    let max = 0;
    const len = nums.length;
    for(let i = 0; i < len; i++) {
        if(max >= len - 1) return true;
        if(i <=  max) { // 到不了 i 就不能从这里起跳
            max = Math.max(i + nums[i], max);
        }
    }
    return false;
};
