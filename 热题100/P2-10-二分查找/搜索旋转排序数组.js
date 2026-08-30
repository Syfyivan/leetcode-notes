/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 *
 * 思路：
 * 1. 旋转后左右两段各自有序，先看 mid 落在哪一段。
 * 2. 目标落在有序段内就缩那一侧，否则缩另一侧。
 * 3. 边界：nums[mid] >= nums[left] 判定左段有序；target 区间不要把 mid 再算进去。
 * 复杂度：时间 O(log n)，空间 O(1)
 */
var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while(left <= right) {
        const mid = Math.floor((left + right) / 2);
        if(nums[mid] === target) return mid;
        else if(nums[mid] >= nums[left]) { // 左半段有序（mid==left 时也成立）
           if(nums[left] <= target && nums[mid] > target) {
            right = mid - 1
           } else{
            left = mid + 1
           }
        }
        else {
            if(nums[right] >= target && nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
};
