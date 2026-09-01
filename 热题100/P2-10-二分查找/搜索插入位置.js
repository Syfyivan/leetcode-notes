/**
 * 热题 100 · 搜索插入位置
 *
 * 优先级：Hot 100 · P2
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 *
 * 思路：
 * 1. 找第一个 >= target 的下标，即 lower_bound。
 * 2. 区间 [left, right) 左闭右开，right 取 nums.length。
 * 3. 边界：nums[mid] < target 才 left = mid + 1，相等时 right = mid 继续往左。
 * 复杂度：时间 O(log n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - upper_bound：第一个 > target，判断改成 nums[mid] <= target 才丢左半。
 * - 有重复找左端：就是本题 lower_bound。
 * - 闭区间写法：right = n-1，相等时 right = mid-1，最后返回 left。
 *
 * ——— 常见追问 ———
 * Q: 找不到为什么返回 left？
 * A: left 停在第一个 >= target 的位置，插在这里仍有序。比全部大时 left 等于 n。
 *
 * Q: 为什么 right 取 n 不是 n-1？
 * A: 左闭右开，插入位可以是末尾。right 取 n-1 还要单独处理「插到最后」。
 *
 * Q: 死循环怎么来的？
 * A: 左闭右闭却写成 right = mid，区间不缩。或者 mid 用了向零取整且 left = mid。
 *
 * Q: 相等为什么还往左缩？
 * A: 要的是插入位，也是最左的 target。相等说明 mid 仍可能偏右，right = mid 接着找。
 */
var searchInsert = function(nums, target) {
    let left = 0;
    let right = nums.length; // 左闭右开，right 允许取到 n

    while(left < right) {
        let mid = Math.floor((left + right) / 2)
        if(nums[mid] < target) {
            left = mid + 1;
        }
        else {
            right = mid; // 不能 mid-1，mid 可能就是插入位
        }
    }
    return left
};

/**
 * 延伸 1：支持对象数组的 lowerBound
 *
 * 需求：按 key(item) 找到第一个不小于 target 的位置。
 *
 * 思路：搜索区间使用 [left,right)，key(array[mid]) < target 时排除左半段。
 *
 * ——— 示例 ———
 * 示例：[{x:1},{x:3}] 中 target=2、key=item.x，返回 1。
 *
 * 复杂度：时间 O(log n)，空间 O(1)。
 */
function lowerBoundBy(array, target, key = (value) => value) {
  let left = 0;
  let right = array.length;
  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (key(array[middle]) < target) left = middle + 1;
    else right = middle;
  }
  return left;
}

// —— 自测 ——
console.log(searchInsert([1, 3, 5, 6], 2)); // 1

module.exports = { searchInsert, lowerBoundBy };
