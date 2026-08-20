/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const res = [];
    res[0] = nums[0];
    res[1] = Math.max(nums[0], nums[1]);

    for(let i = 2; i < nums.length; i++) {
        res[i] = Math.max(res[i - 1], res[i - 2] + nums[i]);
    }
    return res[nums.length - 1];
};