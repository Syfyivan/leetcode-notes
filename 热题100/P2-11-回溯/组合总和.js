/**
 * 热题 100 · 组合总和
 *
 * 优先级：Hot 100 · P2
 */

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

——— 延伸 ———
- 组合总和 II：每个数只能用一次，同层相同值要跳过。
- 组合总和 III：k 个数凑 n，多一个剩余个数约束。
- 先排序再剪枝：candidates[i] 已经大于剩余额度，后面更大，直接 break。

——— 常见追问 ———
Q: 为什么递归传 i 不传 i+1？
A: 同一个数能反复选。传 i+1 就变成组合总和 II 的「每人一次」。

Q: 和子集差在哪？
A: 子集每个节点都收。这里有额度，凑够才收，超了剪掉。

Q: 必须拷贝 path 吗？
A: 必须。path 是共享的，后面还要 pop。

Q: 无解返回什么？
A: 空数组。dfs 收不到任何一份，res 保持 []。
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
        if(sum > target) return; // 再往下只更大，剪掉
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

/**
 * 延伸 1：每个数字只能使用一次（LeetCode 40）
 *
 * 需求：输入可重复，每个下标最多选一次，输出组合不能重复。
 *
 * 思路：排序后从 i+1 递归；同层相同数字跳过，当前值超过剩余目标就停止。
 *
 * ——— 示例 ———
 * 示例：[10,1,2,7,6,1,5]，target=8，输出 4 个不同组合。
 *
 * 复杂度：最坏 O(2^n)，递归空间 O(n)。
 */
function combinationSum2(candidates, target) {
  const sorted = candidates.slice().sort((a, b) => a - b);
  const result = [];
  const path = [];
  function backtrack(start, rest) {
    if (rest === 0) {
      result.push(path.slice());
      return;
    }
    for (let i = start; i < sorted.length && sorted[i] <= rest; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      path.push(sorted[i]);
      backtrack(i + 1, rest - sorted[i]);
      path.pop();
    }
  }
  backtrack(0, target);
  return result;
}

// —— 自测 ——
console.log(combinationSum([2, 3, 6, 7], 7));

module.exports = { combinationSum, combinationSum2 };
