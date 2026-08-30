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
            res.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            dfs();
            path.pop();
            used[i] = false;
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
