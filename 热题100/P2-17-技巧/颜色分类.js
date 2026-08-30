/**
 * 颜色分类（LeetCode 75）
 *
 * 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums，请原地对它们进行排序，
 * 使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
 * 我们使用整数 0、1 和 2 分别表示红色、白色和蓝色。必须在不使用库内置的 sort 函数的情况下解决这个问题。
 *
 * ——— 示例 ———
 * 输入： nums = [2,0,2,1,1,0]
 * 输出： [0,0,1,1,2,2]
 *
 * 输入： nums = [2,0,1]
 * 输出： [0,1,2]
 *
 * 思路：
 * 1. 荷兰国旗三指针：p0 写 0，p2 写 2，i 扫描。
 * 2. 遇 0 与 p0 交换，遇 2 与 p2 交换，遇 1 只 i++。
 * 3. 边界：换 2 后 i 不能立刻 +1，新换来的还没看；循环条件 i <= p2。
 * 复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {number[]} nums
 * @return {number[]} 原地修改后返回 nums 便于打印
 */
function sortColors(nums) {
    let p0 = 0;
    let i = 0;
    let p2 = nums.length - 1;
    while (i <= p2) {
        if (nums[i] === 0) {
            const t = nums[i];
            nums[i] = nums[p0];
            nums[p0] = t;
            p0++;
            i++;
        } else if (nums[i] === 2) {
            const t = nums[i];
            nums[i] = nums[p2];
            nums[p2] = t;
            p2--; // 换来的可能是 0/1/2，i 停住再看
        } else {
            i++;
        }
    }
    return nums;
}

// —— 自测 ——
console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0,0,1,1,2,2]
console.log(sortColors([2, 0, 1])); // [0,1,2]

module.exports = { sortColors };
