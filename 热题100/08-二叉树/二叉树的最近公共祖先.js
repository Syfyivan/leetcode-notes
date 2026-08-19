/**
 * 二叉树的最近公共祖先（LC236）
 *
 * 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
 * 最近公共祖先的定义为：对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，
 * 满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。
 *
 * ——— 示例 ———
 * 输入： root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 * 输出： 3
 *
 * 输入： root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
 * 输出： 5
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

// 按值查找节点引用，方便自测传入 p、q
function findNode(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) || findNode(root.right, val);
}

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
function lowestCommonAncestor(root, p, q) {
  // TODO
}

// —— 自测 ——
const r1 = build([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const a1 = lowestCommonAncestor(r1, findNode(r1, 5), findNode(r1, 1));
console.log(a1 ? a1.val : null); // 期望输出 3

const r2 = build([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const a2 = lowestCommonAncestor(r2, findNode(r2, 5), findNode(r2, 4));
console.log(a2 ? a2.val : null); // 期望输出 5

module.exports = { lowestCommonAncestor, TreeNode, build };
