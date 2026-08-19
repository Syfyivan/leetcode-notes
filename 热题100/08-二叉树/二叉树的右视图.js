/**
 * 二叉树的右视图（LC199）
 *
 * 给定一个二叉树的根节点 root ，想象自己站在它的右侧，
 * 按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
 *
 * ——— 示例 ———
 * 输入： root = [1,2,3,null,5,null,4]
 * 输出： [1,3,4]
 *
 * 输入： root = [1,null,3]
 * 输出： [1,3]
 *
 * 输入： root = []
 * 输出： []
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
 * @return {number[]}
 */
function rightSideView(root) {
  // TODO
}

// —— 自测 ——
console.log(rightSideView(build([1, 2, 3, null, 5, null, 4]))); // 期望输出 [1,3,4]
console.log(rightSideView(build([1, null, 3]))); // 期望输出 [1,3]
console.log(rightSideView(build([]))); // 期望输出 []

module.exports = { rightSideView, TreeNode, build };
