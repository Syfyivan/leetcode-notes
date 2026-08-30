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
 *
 * ——— 延伸 ———
 * - 有重复（LC81）：nums[mid] == nums[left] 时 left++，最坏 O(n)。
 * - 先找最小值再普通二分：两次 log n，好写但常数大。
 * - 只问在不在：返回 boolean，逻辑一样。
 *
 * ——— 常见追问 ———
 * Q: 怎么判断哪一段有序？
 * A: nums[mid] >= nums[left] 则 [left, mid] 升序。旋转断点在右半。
 *
 * Q: 等号为什么要写上？
 * A: mid 和 left 重合时左半只有一个数，也算有序。丢掉等号会走错分支。
 *
 * Q: target 落在有序段外怎么办？
 * A: 有序段排除掉，去另一半。判断写成闭开区间，别把 mid 再算进去。
 *
 * Q: 只有一个元素？
 * A: left == right == 0，mid 就是它，相等返回 0，不等返回 -1。
 */
var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while(left <= right) {
        const mid = Math.floor((left + right) / 2);
        if(nums[mid] === target) return mid;
        else if(nums[mid] >= nums[left]) { // 左半段有序（mid==left 时也成立）
           if(nums[left] <= target && nums[mid] > target) {
            right = mid - 1 // 目标在左半有序段内，砍掉 mid 及右边
           } else{
            left = mid + 1
           }
        }
        else {
            if(nums[right] >= target && nums[mid] < target) {
                left = mid + 1; // 目标在右半有序段内
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
};
