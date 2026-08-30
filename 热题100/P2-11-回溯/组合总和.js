/*给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，
找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。
candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 
对于给定的输入，保证和为 target 的不同组合数少于 150 个。

示例 1：
输入：candidates = [2,3,6,7], target = 7
输出：[[2,2,3],[7]]
解释：2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
     7 也是一个候选， 7 = 7 。仅有这两种组合。

思路：
1. 从 start 往后选，同一数字可复用，递归仍传 i。
2. sum > target 剪枝；sum === target 收一份拷贝。
3. 边界：必须传 i 不能传 i+1，否则无法重复选。
复杂度：时间 O(n^{T/m})，空间 O(T/m)，T 为目标，m 为最小候选
*/

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
    const res = [];
    const path = [];

    const dfs = (start, sum) => {
        if(sum > target) return;
        if(sum === target) {
            res.push([...path]);
            return;
        }
        for(let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            dfs(i, sum + (candidates[i])); // start=i 可复用当前数
            path.pop();
        }
    }
    dfs(0, 0);
    return res;
};
