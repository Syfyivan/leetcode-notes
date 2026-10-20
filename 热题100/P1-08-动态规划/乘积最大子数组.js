/**
 * 热题 100 · 乘积最大子数组
 *
 * 优先级：Hot 100 · P1
 */

// 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

// 测试用例的答案是一个 32-位 整数。
// 请注意，一个只包含一个元素的数组的乘积是这个元素的值。

// 示例 1:
// 输入: nums = [2,3,-2,4]
// 输出: 6
// 解释: 子数组 [2,3] 有最大乘积 6。

/**
 * 思路：
 * 1. 负数会让最大变最小、最小变最大，所以同时维护以 i 结尾的最大乘积和最小乘积。
 * 2. maxF / minF 都从「自己、乘上一段最大、乘上一段最小」里取。
 * 3. 边界：遇到 0 会把连续乘积切断，从当前元素重新开始。
 * 复杂度：时间 O(n)，空间 O(1)

 *
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    let maxF = nums[0];   // 以当前元素结尾的最大乘积
    let minF = nums[0];
    let res = nums[0];
    const len = nums.length;

    for(let i = 1; i < len; i++) {
       const x = nums[i];
       const prevMax = maxF, prevMin = minF; // 先拷一份，避免 maxF 改完 minF 用到新值
       maxF = Math.max(x, prevMax * x, prevMin * x);
       minF = Math.min(x, prevMax * x, prevMin * x);
       res = Math.max(res, maxF);
    }
    return res;
};

/**
 * 延伸 1：返回最大乘积区间
 *
 * 需求：返回最大乘积及对应的左右下标。
 *
 * 思路：同时维护以当前位置结尾的最大/最小乘积和各自起点；负数会让两者交换角色。
 *
 * ——— 示例 ———
 * 示例：[2,3,-2,4] 返回 {product:6,start:0,end:1}。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 */
function maxProductWithRange(nums) {
  if (nums.length === 0) return { product: 0, start: -1, end: -1 };
  let maxEnding = nums[0];
  let minEnding = nums[0];
  let maxStart = 0;
  let minStart = 0;
  let answer = { product: nums[0], start: 0, end: 0 };
  for (let i = 1; i < nums.length; i++) {
    const candidates = [
      { value: nums[i], start: i },
      { value: maxEnding * nums[i], start: maxStart },
      { value: minEnding * nums[i], start: minStart },
    ];
    const nextMax = candidates.reduce((best, item) => item.value > best.value ? item : best);
    const nextMin = candidates.reduce((best, item) => item.value < best.value ? item : best);
    maxEnding = nextMax.value;
    maxStart = nextMax.start;
    minEnding = nextMin.value;
    minStart = nextMin.start;
    if (maxEnding > answer.product) answer = { product: maxEnding, start: maxStart, end: i };
  }
  return answer;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么同时维护最大和最小？
 * A: 负负得正。当前是负数时，前一段最小（很负）乘上去反而最大。
 *
 * Q: 为什么先拷 prevMax / prevMin？
 * A: maxF 改完再用新值算 minF 就串了。必须用更新前的一对。
 *
 * Q: 单个负数？
 * A: maxF = minF = 该数，res 也是它。空子数组不允许。
 *
 * Q: 和 Kadane 的差别？
 * A: Kadane 丢负前缀。乘积不能丢负数，它可能让后面的负号翻正。
 */

// —— 自测 ——
console.log(maxProduct([2, 3, -2, 4])); // 6

module.exports = { maxProduct, maxProductWithRange };
