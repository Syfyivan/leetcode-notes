/**
 * 全排列（LC46）
 *
 * 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。
 * 你可以 按任意顺序 返回答案。
 *
 * ——— 示例 ———
 * 输入： nums = [1,2,3]
 * 输出： [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 *
 * 输入： nums = [0,1]
 * 输出： [[0,1],[1,0]]
 *
 * 输入： nums = [1]
 * 输出： [[1]]
 *
 * 思路：
 * 1. 每层从没用过的数里挑一个放进 path。
 * 2. used 标记选过的下标，选时打标，回溯擦掉。
 * 3. 边界：path 长度等于 n 才收；本题无重复值，按下标防重即可。
 * 复杂度：时间 O(n * n!)，空间 O(n)
 *
 * ——— 延伸 ———
 * - 有重复（LC47）：先排序，同值且前一个没用过就跳，砍掉同层重复。
 * - 交换写法：swap(i, start) 再 dfs(start+1)，少一个 used 数组。
 * - 第 k 个排列：康托展开，不必把 n! 种都枚举出来。
 *
 * ——— 常见追问 ———
 * Q: 为什么 push 的是拷贝？
 * A: path 是同一份数组，后面 pop 会改它。不拷贝的话 res 里全是空数组。
 *
 * Q: used 按下标还是按值？
 * A: 本题值不重复，按下标。有重复值时按下标仍会产出重复排列，要加同层去重。
 *
 * Q: 漏掉 pop / 擦 used 会怎样？
 * A: 状态带进兄弟分支。path 越来越长，后面的数再也选不了。
 *
 * Q: 时间和空间怎么来的？
 * A: n! 种排列，每种要 O(n) 拷贝。递归深度 n，used 也是 O(n)。
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function permute(nums) {
    const res = [];
    const path = [];
    const used = new Array(nums.length).fill(false);
    const dfs = () => {
        if (path.length === nums.length) {
            res.push([...path]); // 必须拷贝，path 之后会被 pop 改空
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            dfs();
            path.pop();
            used[i] = false; // 回溯：同层其他位置还要用这个数
        }
    };
    dfs();
    return res;
}

// —— 自测 ——
console.log(permute([1, 2, 3])); // 期望输出 [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(permute([0, 1])); // 期望输出 [[0,1],[1,0]]
console.log(permute([1])); // 期望输出 [[1]]

module.exports = { permute };
