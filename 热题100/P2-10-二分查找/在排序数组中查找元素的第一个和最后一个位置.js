/**
 * 热题 100 · 在排序数组中查找元素的第一个和最后一个位置
 *
 * 优先级：Hot 100 · P2
 */

/**
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
如果数组中不存在目标值 target，返回 [-1, -1]。
你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
 * 思路：
 * 1. 两次 lower_bound：第一次找 target，第二次找 target+1。
 * 2. start 合法且等于 target 才有解；end = 第二次结果 - 1。
 * 3. 边界：先判 start === n，再读 nums[start]，避免越界。
 * 复杂度：时间 O(log n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 只要左端：一次 find(target) 再判越界，不必找 target+1。
 * - 出现次数：找到两端后 end - start + 1，没有就 0。
 * - 旋转数组里带重复：先定位有序段，再对各段套同一套 lower_bound。
 *
 * ——— 常见追问 ———
 * Q: 一次二分能同时拿到两端吗？
 * A: 不好写。左端要在相等时继续往左，右端要往右，收缩方向反着。拆两次最稳。
 *
 * Q: 为什么 right 取 nums.length？
 * A: 左闭右开，插入位可以是 n。全比 target 小就该返回 n，再减 1 得到最后一格。
 *
 * Q: 找不到为什么先看 start === n？
 * A: start 可能等于长度，先读 nums[start] 会越界。短路写在前面。
 *
 * Q: 数组全是 target 呢？
 * A: find(target) 得到 0，find(target+1) 得到 n，两端就是 [0, n-1]。
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
    // lower_bound：返回第一个 >= num 的下标（就是 35 的模板，一字不改）
    const find = (num) => {
        let left = 0;
        let right = nums.length; // 左闭右开
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (nums[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    };

    const start = find(target); // 第一个 >= target = 第一个 target（若存在）
    // 顺序关键：先判越界，靠 || 短路，避免访问越界的 nums[start]
    if (start === nums.length || nums[start] !== target) return [-1, -1];
    const findUpper = () => {
        let left = 0;
        let right = nums.length;
        while (left < right) {
            const mid = left + ((right - left) >> 1);
            if (nums[mid] <= target) left = mid + 1;
            else right = mid;
        }
        return left;
    };
    const end = findUpper() - 1; // 第一个 > target 的位置减一
    return [start, end];
};

/**
 * 延伸 1：统计目标出现次数
 *
 * 需求：不线性扫描，通过左右边界之差得到出现次数。
 *
 * 思路：lowerBound(target) 找首位，upperBound(target) 找末位后一格。
 *
 * ——— 示例 ———
 * 示例：[5,7,7,8,8,10] 中 8 出现 2 次。
 *
 * 复杂度：时间 O(log n)，空间 O(1)。
 */
function countOccurrences(nums, target) {
  const lowerBound = (value) => {
    let left = 0;
    let right = nums.length;
    while (left < right) {
      const middle = left + Math.floor((right - left) / 2);
      if (nums[middle] < value) left = middle + 1;
      else right = middle;
    }
    return left;
  };
  const upperBound = (value) => {
    let left = 0;
    let right = nums.length;
    while (left < right) {
      const middle = left + Math.floor((right - left) / 2);
      if (nums[middle] <= value) left = middle + 1;
      else right = middle;
    }
    return left;
  };
  return upperBound(target) - lowerBound(target);
}

// —— 自测 ——
console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // [3,4]

module.exports = { searchRange, countOccurrences };
