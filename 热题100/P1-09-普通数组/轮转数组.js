/**
 * 思路：
 * 1. 右旋 k 步等于：整体翻转，再翻转前 k 个，再翻转后面。
 * 2. k 先对 n 取模，k=0 等于没动。
 * 3. 边界：n <= 1 不用处理。必须原地改 nums。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    const n = nums.length;
    if (n <= 1) return;
    k = k % n;
    const reverse = (l, r) => {
        while (l < r) {
            [nums[l], nums[r]] = [nums[r], nums[l]];
            l++;
            r--;
        }
    };
    reverse(0, n - 1);
    reverse(0, k - 1);
    reverse(k, n - 1);
};
