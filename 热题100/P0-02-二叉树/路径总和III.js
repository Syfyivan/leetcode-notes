/**
 * 路径总和 III（LC437）
 *
 * 给定一个二叉树的根节点 root ，和一个整数 targetSum ，
 * 求该二叉树里节点值之和等于 targetSum 的路径的数目。
 * 路径不需要从根节点开始，也不需要在叶子节点结束，
 * 但是路径方向必须是向下的（只能从父节点到子节点）。
 *
 * ——— 示例 ———
 * 输入： root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 * 输出： 3
 *
 * 输入： root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
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
 * @param {number} targetSum
 * @return {number}
 */
function pathSum(root, targetSum) {
}

// —— 自测 ——
console.log(pathSum(build([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8)); // 期望输出 3
console.log(pathSum(build([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22)); // 期望输出 3

module.exports = { pathSum, TreeNode, build };
