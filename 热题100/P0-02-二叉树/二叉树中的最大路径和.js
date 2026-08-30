/**
 * 二叉树中的最大路径和（LC124）
 *
 * 二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。
 * 同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
 * 路径和 是路径中各节点值的总和。给你一个二叉树的根节点 root ，返回其 最大路径和 。
 *
 * 思路：
 * 1. 任意路径（不一定过根）的最大节点值和。
 * 2. 后序：当拐点时左右都能带；向上只带一边。负贡献丢掉。
 * 3. 单节点路径也算。全局用 -Infinity 起步。
 * 复杂度：时间 O(n)，空间 O(h)
 *
 * ——— 示例 ———
 * 输入： root = [1,2,3]
 * 输出： 6
 *
 * 输入： root = [-10,9,20,null,null,15,7]
 * 输出： 42
 */

function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
// 用层序数组建树（null 表示空节点），方便自测
function build(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxPathSum(root) {
  let ans = -Infinity;
  const dfs = (node) => {
    if (!node) return 0;
    const left = Math.max(0, dfs(node.left));   // 负的不带
    const right = Math.max(0, dfs(node.right));
    ans = Math.max(ans, node.val + left + right); // 当拐点
    return node.val + Math.max(left, right);      // 向上只选一边
  };
  dfs(root);
  return ans;
}

// —— 自测 ——
console.log(maxPathSum(build([1, 2, 3]))); // 期望输出 6
console.log(maxPathSum(build([-10, 9, 20, null, null, 15, 7]))); // 期望输出 42

module.exports = { maxPathSum, TreeNode, build };
