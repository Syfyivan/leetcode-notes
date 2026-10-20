/**
 * 热题 100 · 搜索旋转排序数组
 *
 * 优先级：Hot 100 · P2
 */

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

/**
 * 延伸 1：允许重复元素（LeetCode 81）
 *
 * 需求：数组旋转且可能重复，只判断 target 是否存在。
 *
 * 思路：当 left、mid、right 三值相等时同时收缩两端；其余仍判断哪一半有序。
 *
 * ——— 示例 ———
 * 示例：[2,5,6,0,0,1,2] 查找 0 返回 true，查找 3 返回 false。
 *
 * 复杂度：平均 O(log n)，全重复时退化 O(n)。
 */
function searchWithDuplicates(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);
    if (nums[middle] === target) return true;
    if (nums[left] === nums[middle] && nums[middle] === nums[right]) {
      left++;
      right--;
    } else if (nums[left] <= nums[middle]) {
      if (nums[left] <= target && target < nums[middle]) right = middle - 1;
      else left = middle + 1;
    } else if (nums[middle] < target && target <= nums[right]) left = middle + 1;
    else right = middle - 1;
  }
  return false;
}

/**
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

// —— 自测 ——
console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4

module.exports = { search, searchWithDuplicates };
