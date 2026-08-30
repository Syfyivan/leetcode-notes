/**
 * 多数元素（LeetCode 169）
 *
 * 给定一个大小为 n 的数组 nums，返回其中的多数元素。多数元素是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。
 * 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
 *
 * ——— 示例 ———
 * 输入： nums = [3,2,3]
 * 输出： 3
 *
 * 输入： nums = [2,2,1,1,1,2,2]
 * 输出： 2
 *
 * 思路：
 * 1. Boyer-Moore：相同 count++，不同 count--。
 * 2. count 掉到 0 就换候选人。
 * 3. 边界：题保证多数一定存在，最后候选即答案。
 * 复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function majorityElement(nums) {
    let cand = 0;
    let count = 0;
    for (const x of nums) {
        if (count === 0) cand = x;
        count += x === cand ? 1 : -1;
    }
    return cand;
}

// —— 自测 ——
console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2

module.exports = { majorityElement };
