/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    if(nums.length <= 1) return nums;

    k = k % nums.length;
    
    const newStartIndex = nums.length - k - 1;
    let res = [];


    for(let i = newStartIndex; i < nums.length; i++) {
        res.push(nums[i]);
    }

    for(let j = 0; j < newStartIndex; j++) {
        res.push(nums[j]);
    }

    // if(res.length === nums.length) 
    //     return res;
    nums.splice(0, nums.length, ...res);
};