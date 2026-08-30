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
    for (const n of nums) x ^= n;
    return x;
}

// —— 自测 ——
console.log(singleNumber([2, 2, 1])); // 1
console.log(singleNumber([4, 1, 2, 1, 2])); // 4
console.log(singleNumber([1])); // 1

module.exports = { singleNumber };
