/**
 * 热题 100 · 只出现一次的数字
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 只出现一次的数字（LeetCode 136）
 *
 * 给你一个非空整数数组 nums，除了某个元素只出现一次以外，其余每个元素均出现两次。
 * 找出那个只出现了一次的元素。
 * 你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
 *
 * ——— 示例 ———
 * 输入： nums = [2,2,1]
 * 输出： 1
 *
 * 输入： nums = [4,1,2,1,2]
 * 输出： 4
 *
 * 输入： nums = [1]
 * 输出： 1
 *
 * 思路：
 * 1. 全部异或，成对的抵消成 0。
 * 2. 剩下的就是只出现一次的数。
 * 3. 边界：单个元素直接返回。
 * 复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
    let x = 0;
    for (const n of nums) x ^= n; // 成对抵消，剩下单独那个
    return x;
}

/**
 * 延伸 1：其余数字都出现三次
 *
 * 需求：除一个数字出现一次外，其余数字都恰好出现三次，要求线性时间和常量空间。
 *
 * 思路：ones、twos 记录每一位出现次数模 3 的状态；第三次出现时该位会同时从两者中清除。
 *
 * ——— 示例 ———
 * 示例：singleNumberAmongTriples([2,2,3,2]) => 3
 *
 * 复杂度：时间 O(n)，空间 O(1)
 */
function singleNumberAmongTriples(nums) {
    let ones = 0;
    let twos = 0;
    for (const num of nums) {
        ones = (ones ^ num) & ~twos;
        twos = (twos ^ num) & ~ones;
    }
    return ones;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么成对会消掉？
 * A: a^a=0，0^x=x。全异或完，成对的变 0，剩下单独那个。
 *
 * Q: 出现三次还管用吗？
 * A: 不管用。a^a^a = a，消不干净。要改位计数。
 *
 * Q: 负数呢？
 * A: JS 位运算按 32 位有符号整数。异或对负数同样成对抵消。
 *
 * Q: 只有一个元素？
 * A: x 从 0 异或它，直接得到它。
 */

// —— 自测 ——
console.log(singleNumber([2, 2, 1])); // 1
console.log(singleNumber([4, 1, 2, 1, 2])); // 4
console.log(singleNumber([1])); // 1
console.log(singleNumberAmongTriples([2, 2, 3, 2])); // 3

module.exports = { singleNumber, singleNumberAmongTriples };
