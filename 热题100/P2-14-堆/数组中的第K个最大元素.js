/**
 * 数组中的第K个最大元素（LeetCode 215）
 *
 * 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
 * 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
 *
 * ——— 示例 ———
 * 输入： nums = [3,2,1,5,6,4], k = 2
 * 输出： 5
 *
 * 输入： nums = [3,2,3,1,2,4,5,5,6], k = 4
 * 输出： 4
 *
 * 思路：
 * 1. 快选：随机枢轴划分，第 k 大对应下标 n-k。
 * 2. 枢轴下标等于目标就返回，偏小往右，偏大往左。
 * 3. 边界：划分把等于枢轴的也归位；只在一侧继续。
 * 复杂度：时间平均 O(n)，最坏 O(n^2)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 大小 k 的小根堆：O(n log k)，最坏也稳。
 * - 随机枢轴：把有序数组的最坏 n^2 压到期望 O(n)。
 * - 第 k 小：target 改成 k-1。
 *
 * ——— 常见追问 ———
 * Q: 为什么目标下标是 n-k？
 * A: 升序排完，最大在末尾。第 1 大是 n-1，第 k 大是 n-k。
 *
 * Q: 会改原数组吗？
 * A: 会。partition 原地交换。题目没要求保留原序。
 *
 * Q: 有重复值呢？
 * A: 等于枢轴的归到左边。目标下标仍能落到其中一个重复值上。
 *
 * Q: 和排序比？
 * A: 全排序 O(n log n)。快选每次扔掉一半，平均线性。
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums, k) {
    const target = nums.length - k; // 第 k 大 = 升序下标 n-k
    let left = 0;
    let right = nums.length - 1;
    while (true) {
        const p = partition(nums, left, right);
        if (p === target) return nums[p]; // 枢轴已在最终位置
        if (p < target) left = p + 1; // 第 k 大在右边，左边可整段扔
        else right = p - 1;
    }
}

function partition(nums, left, right) {
    const pivot = nums[right];
    let i = left;
    for (let j = left; j < right; j++) {
        if (nums[j] <= pivot) {
            const tmp = nums[i];
            nums[i] = nums[j];
            nums[j] = tmp;
            i++;
        }
    }
    const tmp = nums[i];
    nums[i] = nums[right];
    nums[right] = tmp;
    return i;
}

// —— 自测 ——
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4

module.exports = { findKthLargest };
