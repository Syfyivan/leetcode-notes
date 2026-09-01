/**
 * 热题 100 · 移动零
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 移动零（LeetCode 283）
 *
 * 给定一个数组 nums，将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 * 必须在不复制数组的情况下原地对数组进行操作。
 *
 * 思路：
 * 1. slow 指向下一个该放非零的位置，fast 从左扫到右。
 * 2. nums[fast] 不是 0，就和 slow 交换，slow++。
 * 3. 边界：全是 0 或没有 0 都不用特判。必须原地，相对顺序不能乱。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： nums = [0, 1, 0, 3, 12]
 * 输出： [1, 3, 12, 0, 0]
 *
 * 输入： nums = [0]
 * 输出： [0]
 *
 * 输入： nums = [1, 2, 3]
 * 输出： [1, 2, 3]
 *
 * ——— 延伸 ———
 * - 把指定值 val 移到末尾：判断从 !== 0 改成 !== val。
 * - 删除元素（LC 27）：慢指针覆写，返回新长度，后面不用管。
 * - 稳定分割：快慢指针把小于 pivot 的挤到左边，快排 partition。
 *
 * ——— 常见追问 ———
 * Q: 为什么交换而不是直接覆写？
 * A: 交换把 0 换到后面，相对顺序也保住。覆写还得第二遍把 slow 后面填 0。
 *
 * Q: 相对顺序会乱吗？
 * A: 不会。fast 从左到右，遇到的非零按出现顺序丢到 slow。
 *
 * Q: slow 和 fast 碰上怎么办？
 * A: 非零时自己跟自己换，等于没动。全非零就是这种情况。
 *
 * Q: 能从右往左扫吗？
 * A: 可以收集 0 到右边，但非零相对顺序不好保。从左扫更直接。
 */

/**
 * @param {number[]} nums
 * @return {number[]}   原地修改 nums，此处返回 nums 便于自测打印
 */
function moveZeroes(nums) {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]]; // 碰上自己换自己，0 被换到后面
      slow++;
    }
  }
  return nums;
}

/**
 * 延伸 1：把指定值稳定移到末尾
 *
 * 需求：原地移动所有等于 value 的元素，其余元素保持相对顺序。
 *
 * 思路：慢指针写入所有非 value 元素，剩余位置统一填 value。
 *
 * ——— 示例 ———
 * 示例：[2,1,2,3]，value=2，变为 [1,3,2,2]。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 */
function moveValueToEnd(nums, value) {
  let write = 0;
  for (const item of nums) if (item !== value) nums[write++] = item;
  while (write < nums.length) nums[write++] = value;
  return nums;
}

// —— 自测 ——
console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
console.log(moveZeroes([0]));              // [0]
console.log(moveZeroes([1, 2, 3]));        // [1, 2, 3]

module.exports = { moveZeroes, moveValueToEnd };
