/**
 * 思路：
 * 1. 右旋 k 步等于：整体翻转，再翻转前 k 个，再翻转后面。
 * 2. k 先对 n 取模，k=0 等于没动。
 * 3. 边界：n <= 1 不用处理。必须原地改 nums。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 左旋 k 步：先翻前 k，再翻后面，再整体翻。或右旋 n-k。
 * - 环状替换：每个位置跳 k 步，数几个环。
 * - 链表旋转：连成环再在 n-k 处断开。
 *
 * ——— 常见追问 ———
 * Q: 为什么三次翻转？
 * A: 整体翻让后 k 个到前面但内部反了；再各自翻回来。
 *
 * Q: k 为什么取模？
 * A: 转 n 次等于没转。k = 0 时后两次翻转会把整体翻回去，等于没动。
 *
 * Q: n <= 1 为什么直接 return？
 * A: 转不转都一样。也避免 n = 0 时取模。
 *
 * Q: 和新数组写法比？
 * A: 三次翻转空间 O(1)，多几次交换。面试常考这个。
 *
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    const n = nums.length;
    if (n <= 1) return;
    k = k % n; // 转 n 次等于没转；k=0 时后两次翻会把整体翻回去
    const reverse = (l, r) => {
        while (l < r) {
            [nums[l], nums[r]] = [nums[r], nums[l]];
            l++;
            r--;
        }
    };
    reverse(0, n - 1);     // 后 k 个到前面，内部是反的
    reverse(0, k - 1);     // 前 k 翻回来
    reverse(k, n - 1);     // 后 n-k 翻回来
};
