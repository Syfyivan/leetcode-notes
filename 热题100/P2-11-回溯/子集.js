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
            dfs(i + 1); // start=i+1，不能复用当前数
            path.pop()
        }
    }
    dfs(0);
    return res;
};
