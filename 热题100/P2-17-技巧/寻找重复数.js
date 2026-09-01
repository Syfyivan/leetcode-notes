/**
 * 热题 100 · 寻找重复数
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 寻找重复数（LeetCode 287）
 *
 * 给定一个包含 n + 1 个整数的数组 nums，其数字都在 [1, n] 范围内（包括 1 和 n），
 * 可知至少存在一个重复的整数。假设 nums 只有一个重复的整数，返回这个重复的数。
 * 你设计的解决方案必须不修改数组 nums 且只用常量级 O(1) 的额外空间。
 *
 * ——— 示例 ———
 * 输入： nums = [1,3,4,2,2]
 * 输出： 2
 *
 * 输入： nums = [3,1,3,4,2]
 * 输出： 3
 *
 * 输入： nums = [3,3,3,3,3]
 * 输出： 3
 *
 * 思路：
 * 1. 下标到值看成链表，重复数是环入口。
 * 2. 快慢指针相遇后，慢指针回起点再同步走，交点即入口。
 * 3. 边界：值域是 [1,n]，不会走到 0 以外的死路。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 二分答案：count(<=mid) > mid 则重复在左半。
 * - 可修改数组：把 nums[x] 取负当 vis，第一次碰上负数就是重复。
 * - 哈希：最直观，但额外空间不合题。
 *
 * ——— 常见追问 ———
 * Q: 为什么一定有环？
 * A: n+1 个数取值 [1,n]，必有重复。下标 i 指向 nums[i]，重复值被两个下标指进来，形成环。
 *
 * Q: 和链表入环入口是同一题吗？
 * A: 同一套 Floyd。第二次相遇点就是被两个前驱指向的那个值。
 *
 * Q: 同一个数出现很多次？
 * A: 仍是一个环入口。题目保证只有一个重复整数。
 *
 * Q: 为什么不能排序？
 * A: 排序会改数组。题面禁止修改，也只要 O(1) 额外空间。
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function findDuplicate(nums) {
    let slow = nums[0];
    let fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    slow = nums[0]; // 相遇后再从起点走，第二次相遇是环入口
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}

/**
 * 延伸 1：哈希集合版查重
 *
 * 需求：在空间限制放宽时，用最直观的方式返回第一个再次出现的数字。
 *
 * 思路：顺序扫描；数字已在集合中时立即返回，否则加入集合。
 *
 * ——— 示例 ———
 * 示例：findDuplicateWithSet([1,3,4,2,2]) => 2
 *
 * 复杂度：平均时间 O(n)，空间 O(n)
 */
function findDuplicateWithSet(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return num;
        seen.add(num);
    }
    return -1;
}

// —— 自测 ——
console.log(findDuplicate([1, 3, 4, 2, 2])); // 2
console.log(findDuplicate([3, 1, 3, 4, 2])); // 3
console.log(findDuplicate([3, 3, 3, 3, 3])); // 3
console.log(findDuplicateWithSet([1, 3, 4, 2, 2])); // 2

module.exports = { findDuplicate, findDuplicateWithSet };
