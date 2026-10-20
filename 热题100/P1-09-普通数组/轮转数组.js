/**
 * 热题 100 · 轮转数组
 *
 * 优先级：Hot 100 · P1
 */

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

/**
 * 延伸 1：额外数组版
 *
 * 需求：用最直观的下标映射实现右轮转，返回原数组便于自测。
 *
 * 思路：原下标 i 的值写到 (i+k)%n，最后复制回 nums。
 *
 * ——— 示例 ———
 * 示例：[1,2,3,4,5,6,7]，k=3，变为 [5,6,7,1,2,3,4]。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function rotateWithExtraSpace(nums, k) {
  if (nums.length === 0) return nums;
  k = ((k % nums.length) + nums.length) % nums.length;
  const copy = new Array(nums.length);
  for (let i = 0; i < nums.length; i++) copy[(i + k) % nums.length] = nums[i];
  for (let i = 0; i < nums.length; i++) nums[i] = copy[i];
  return nums;
}

/**
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
 */

// —— 自测 ——
const rotateSample = [1, 2, 3, 4, 5, 6, 7];
rotate(rotateSample, 3);
console.log(rotateSample); // [5,6,7,1,2,3,4]

module.exports = { rotate, rotateWithExtraSpace };
