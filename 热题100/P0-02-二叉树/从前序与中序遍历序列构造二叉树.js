/**
 * 从前序与中序遍历序列构造二叉树（LC105）
 *
 * 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历，
 * inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 *
 * ——— 示例 ———
 * 输入： preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * 输出： [3,9,20,null,null,15,7]
 *
 * 输入： preorder = [-1], inorder = [-1]
 * 输出： [-1]
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

// 中序遍历收集节点值，方便验证构造结果
function inorderTraversal(root) {
  const res = [];
  const go = (node) => {
    if (!node) return;
    go(node.left);
    res.push(node.val);
    go(node.right);
  };
  go(root);
  return res;
}

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
function buildTree(preorder, inorder) {
}

// —— 自测 ——
console.log(inorderTraversal(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]))); // 期望输出 [9,3,15,20,7]
console.log(inorderTraversal(buildTree([-1], [-1]))); // 期望输出 [-1]

module.exports = { buildTree, TreeNode, build };
