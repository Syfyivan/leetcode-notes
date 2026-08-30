/**
 * 寻找两个正序数组的中位数（LC4）
 *
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2 。
 * 请你找出并返回这两个正序数组的 中位数 。
 *
 * 进阶：算法的时间复杂度应该为 O(log (m+n)) 。
 *
 * ——— 示例 ———
 * 输入： nums1 = [1,3], nums2 = [2]
 * 输出： 2.00000
 * 解释： 合并数组 = [1,2,3] ，中位数 2 。
 *
 * 输入： nums1 = [1,2], nums2 = [3,4]
 * 输出： 2.50000
 * 解释： 合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5 。
 *
 * 思路：
 * 1. 在较短数组上二分划分点，让左半一共 (m+n+1)>>1 个数。
 * 2. 合法划分：左1 <= 右2 且 左2 <= 右1。
 * 3. 边界：切在端点时用 ±Infinity 补；奇数取左最大，偶数取左右交界平均。
 * 复杂度：时间 O(log(min(m,n)))，空间 O(1)
 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
    }
    const m = nums1.length;
    const n = nums2.length;
    const leftCnt = Math.floor((m + n + 1) / 2);
    let lo = 0;
    let hi = m;
    while (lo <= hi) {
        const i = Math.floor((lo + hi) / 2); // nums1 左边取 i 个
        const j = leftCnt - i; // nums2 左边取 j 个
        const l1 = i === 0 ? -Infinity : nums1[i - 1];
        const r1 = i === m ? Infinity : nums1[i];
        const l2 = j === 0 ? -Infinity : nums2[j - 1];
        const r2 = j === n ? Infinity : nums2[j];
        if (l1 <= r2 && l2 <= r1) {
            if ((m + n) % 2 === 1) return Math.max(l1, l2);
            return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;
        }
        if (l1 > r2) hi = i - 1; // nums1 左半太大，切点左移
        else lo = i + 1;
    }
    return 0;
}

// —— 自测 ——
console.log(findMedianSortedArrays([1, 3], [2])); // 期望输出 2
console.log(findMedianSortedArrays([1, 2], [3, 4])); // 期望输出 2.5

module.exports = { findMedianSortedArrays };
