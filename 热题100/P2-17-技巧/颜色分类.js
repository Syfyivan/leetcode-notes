/**
 * 热题 100 · 颜色分类
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 颜色分类（LeetCode 75）
 *
 * 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums，请原地对它们进行排序，
 * 使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
 * 我们使用整数 0、1 和 2 分别表示红色、白色和蓝色。必须在不使用库内置的 sort 函数的情况下解决这个问题。
 *
 * ——— 示例 ———
 * 输入： nums = [2,0,2,1,1,0]
 * 输出： [0,0,1,1,2,2]
 *
 * 输入： nums = [2,0,1]
 * 输出： [0,1,2]
 *
 * 思路：
 * 1. 荷兰国旗三指针：p0 写 0，p2 写 2，i 扫描。
 * 2. 遇 0 与 p0 交换，遇 2 与 p2 交换，遇 1 只 i++。
 * 3. 边界：换 2 后 i 不能立刻 +1，新换来的还没看；循环条件 i <= p2。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 只有 0/1：快慢指针，类似移动零。
 * - 计数排序：先数 0/1/2 再写回去，两遍扫描。
 * - 四种颜色：先分两段，再对其中一段继续分。
 *
 * ——— 常见追问 ———
 * Q: 换 2 为什么 i 不动？
 * A: 从右边换来的可能是 0、1、2，还没检查。i++ 会漏。
 *
 * Q: 换 0 为什么 i++？
 * A: p0 左边已经是 0。换到 i 的要么是 0 要么是 1（i 从左扫过来的），可以放心前进。
 *
 * Q: 为什么 i <= p2？
 * A: p2 右边是已归位的 2。i 和 p2 相遇那格还没看，等号要留下。
 *
 * Q: 全是 1？
 * A: 全程走 else，i 走到头，数组不变。
 */

/**
 * @param {number[]} nums
 * @return {number[]} 原地修改后返回 nums 便于打印
 */
function sortColors(nums) {
    let p0 = 0;
    let i = 0;
    let p2 = nums.length - 1;
    while (i <= p2) {
        if (nums[i] === 0) {
            const t = nums[i];
            nums[i] = nums[p0];
            nums[p0] = t;
            p0++;
            i++;
        } else if (nums[i] === 2) {
            const t = nums[i];
            nums[i] = nums[p2];
            nums[p2] = t;
            p2--; // 换来的可能是 0/1/2，i 停住再看
        } else {
            i++;
        }
    }
    return nums;
}

/**
 * 延伸 1：推广到 K 种颜色
 *
 * 需求：元素取值为 0 到 k-1，在不调用内置 sort 的前提下原地完成分类。
 *
 * 思路：先统计每种颜色出现次数，再按颜色编号依次覆盖回原数组。
 *
 * ——— 示例 ———
 * 示例：sortKColors([2,0,3,1,2,0], 4) => [0,0,1,2,2,3]
 *
 * 复杂度：时间 O(n+k)，空间 O(k)
 */
function sortKColors(nums, k) {
    const counts = new Array(k).fill(0);
    for (const color of nums) {
        if (!Number.isInteger(color) || color < 0 || color >= k) {
            throw new RangeError("颜色编号必须是 0 到 k-1 的整数");
        }
        counts[color]++;
    }

    let index = 0;
    for (let color = 0; color < k; color++) {
        for (let count = 0; count < counts[color]; count++) nums[index++] = color;
    }
    return nums;
}

// —— 自测 ——
console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0,0,1,1,2,2]
console.log(sortColors([2, 0, 1])); // [0,1,2]
console.log(sortKColors([2, 0, 3, 1, 2, 0], 4)); // [0,0,1,2,2,3]

module.exports = { sortColors, sortKColors };
