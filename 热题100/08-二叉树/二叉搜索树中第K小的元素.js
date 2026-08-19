/**
 * 二叉搜索树中第K小的元素（LC230）
 *
 * 给定一个二叉搜索树的根节点 root ，和一个整数 k ，
 * 请你设计一个算法查找其中第 k 个最小元素（从 1 开始计数）。
 *
 * ——— 示例 ———
 * 输入： root = [3,1,4,null,2], k = 1
 * 输出： 1
 *
 * 输入： root = [5,3,6,2,4,null,null,1], k = 3
 * 输出： 3
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
 * @param {number} k
 * @return {number}
 */
function kthSmallest(root, k) {
  // TODO
}

// —— 自测 ——
console.log(kthSmallest(build([3, 1, 4, null, 2]), 1)); // 期望输出 1
console.log(kthSmallest(build([5, 3, 6, 2, 4, null, null, 1]), 3)); // 期望输出 3

module.exports = { kthSmallest, TreeNode, build };
