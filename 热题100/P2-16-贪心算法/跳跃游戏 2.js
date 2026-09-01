/**
 * 热题 100 · 跳跃游戏 2
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 给定一个长度为 n 的 0 索引整数数组 nums。初始位置在下标 0。
每个元素 nums[i] 表示从索引 i 向后跳转的最大长度。换句话说，如果你在索引 i 处，你可以跳转到任意 (i + j) 处：
0 <= j <= nums[i] 且 i + j < n
返回到达 n - 1 的最小跳跃次数。测试用例保证可以到达 n - 1。

输入: nums = [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
 * 思路：
 * 1. 贪心：在当前这一跳的覆盖范围内，找下一跳能到的最远。
 * 2. i 走到当前覆盖右端就 jumps++，更新覆盖。
 * 3. 边界：循环到 n-2，站在终点不再跳。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 延伸 ———
 * - 不保证能到达：覆盖不到就失败，先当 55 再数步。
 * - 打印路径：再记一个 prev 下标。
 * - 写成 BFS：一层覆盖范围就是一跳。
 *
 * ——— 常见追问 ———
 * Q: 为什么循环到 n-2？
 * A: 已经站在终点不必再跳。i 走到最后一格还会 jumps++，答案多 1。
 *
 * Q: 什么时候 jumps++？
 * A: i 走到当前这一跳的右端，必须再跳一次，覆盖更新成此前看到的最远。
 *
 * Q: 和 55 差在哪？
 * A: 55 只问能不能到，维护一个 max。本题要最少跳数，按覆盖分层。
 *
 * Q: nums[0]=0 且 n>1？
 * A: 题目保证能到达。真碰上，curEnd 走不动，但测试数据不会给。
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {
    let max = 0;
    const len = nums.length;
    let count = 0;
    let curEnd = 0;

    for(let i = 0; i < len - 1; i++) { // 不到最后一个下标，避免多跳一次
        max = Math.max(max, i + nums[i]);
        if(i === curEnd) { // 这一跳的覆盖走完了，必须再跳
            count++;
            curEnd = max;
        }
    }
    return count;
};

/**
 * 延伸 1：还原一条最少跳跃路径
 *
 * 需求：返回一条从下标 0 到末尾的最少跳跃下标序列；不可达时返回空数组。
 *
 * 思路：把每一跳的可达区间看作 BFS 一层，在当前层选出能把下一层右边界推得最远的下标。
 *
 * ——— 示例 ———
 * 示例：jumpPath([2,3,1,1,4]) => [0,1,4]
 *
 * 复杂度：时间 O(n)，路径空间 O(n)
 */
function jumpPath(nums) {
    const n = nums.length;
    if (n === 0) return [];
    if (n === 1) return [0];

    const path = [0];
    let layerStart = 0;
    let layerEnd = 0;
    while (layerEnd < n - 1) {
        let nextEnd = layerEnd;
        let bestIndex = -1;
        for (let i = layerStart; i <= layerEnd; i++) {
            const reach = Math.min(n - 1, i + nums[i]);
            if (reach > nextEnd) {
                nextEnd = reach;
                bestIndex = i;
            }
        }
        if (bestIndex === -1) return [];
        if (path[path.length - 1] !== bestIndex) path.push(bestIndex);
        if (nextEnd === n - 1) {
            path.push(n - 1);
            break;
        }
        layerStart = layerEnd + 1;
        layerEnd = nextEnd;
    }
    return path;
}

// —— 自测 ——
console.log(jump([2, 3, 1, 1, 4]));     // 期望：2
console.log(jumpPath([2, 3, 1, 1, 4])); // 期望：[0,1,4]

module.exports = { jump, jumpPath };
