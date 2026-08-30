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
 *
 * ——— 延伸 ———
 * - 不保证存在：再扫一遍，确认 count > n/2。
 * - 出现超过 n/3：两个候选人，摩尔投票的推广。
 * - 排序取中点：下标 n/2 一定是多数，O(n log n)。
 *
 * ——— 常见追问 ———
 * Q: 为什么最后候选一定对？
 * A: 多数超过一半。每次不同就对消，少数先被消光，留下的只能是多数。
 *
 * Q: count 减到 0 意味着什么？
 * A: 到目前为止，候选和它的反对票打平。后面重新选人。
 *
 * Q: 偶数长度呢？
 * A: 题保证次数 > n/2，偶数也成立。不保证的话要验证。
 *
 * Q: 哈希行不行？
 * A: 行，O(n) 空间。本题想要 O(1)，才上投票。
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function majorityElement(nums) {
    let cand = 0;
    let count = 0;
    for (const x of nums) {
        if (count === 0) cand = x; // 打平了，换新候选人
        count += x === cand ? 1 : -1;
    }
    return cand;
}

// —— 自测 ——
console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2

module.exports = { majorityElement };
