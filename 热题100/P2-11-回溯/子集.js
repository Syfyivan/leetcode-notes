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

——— 延伸 ———
- 有重复（LC90）：先排序，i > start 且 nums[i] == nums[i-1] 则跳过。
- 二进制枚举：0 到 2^n-1，位为 1 就选这个数。
- 子集和：加一个剩余额度，超了剪枝。

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
