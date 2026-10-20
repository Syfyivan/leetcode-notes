/**
 * 热题 100 · 子集
 *
 * 优先级：Hot 100 · P2
 */

/*
给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

示例 1：
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

思路：
1. 每个节点都是一个子集，dfs 一进来就把当前 path 收入答案。
2. for 从 start 往后取，递归传 i+1，每个数只用一次。
3. 边界：空集在 dfs(0) 入口就收下；push 后必须 pop。
复杂度：时间 O(n * 2^n)，空间 O(n)

*/ 

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
    const res = [];
    const path = [];

    const dfs = (start) => {
        res.push([...path]); // 每步都收，包括空集
        for(let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            dfs(i + 1); // start=i+1，只往后拿，避免顺序不同的重复子集
            path.pop()
        }
    }
    dfs(0);
    return res;
};

/**
 * 延伸 1：含重复元素的子集（LeetCode 90）
 *
 * 需求：输入可能重复，输出不能有重复子集。
 *
 * 思路：排序后回溯；同一层遇到与前一项相同的值时跳过。
 *
 * ——— 示例 ———
 * 示例：[1,2,2] 输出 6 个不同子集。
 *
 * 复杂度：结果规模 O(2^n)，空间 O(n)。
 */
function subsetsWithDup(nums) {
  const sorted = nums.slice().sort((a, b) => a - b);
  const result = [];
  const path = [];
  function backtrack(start) {
    result.push(path.slice());
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      path.push(sorted[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return result;
}

/**
——— 常见追问 ———
Q: 为什么一进 dfs 就收？
A: 每个节点都是一个子集，包括空集。收到叶子才收会漏掉中间状态。

Q: start 为什么传 i+1？
A: 每个数最多用一次，且只往后拿，避免 [1,2] 和 [2,1] 算两份。

Q: 和全排列差在哪？
A: 排列看顺序，每层从全部没用过的里挑。子集不看顺序，用 start 限制方向。

Q: 空集从哪来？
A: dfs(0) 入口 path 还是空，第一句就推进 res。
 */

// —— 自测 ——
console.log(subsets([1, 2, 3]).length); // 8

module.exports = { subsets, subsetsWithDup };
