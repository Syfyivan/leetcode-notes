/**
 * 从前序与中序遍历序列构造二叉树（LC105）
 *
 * 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历，
 * inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 *
 * 思路：
 * 1. 用前序和中序还原整棵树。
 * 2. 前序第一个是根，中序里根左边是左子树、右边是右子树。用下标切区间递归。
 * 3. 区间空返回 null。值不重复，用 map 定位根在中序的位置。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * 输出： [3,9,20,null,null,15,7]
 *
 * 输入： preorder = [-1], inorder = [-1]
 * 输出： [-1]
 *
 * ——— 延伸 ———
 * - 后序 + 中序（LC106）：后序最后一个是根，先建右再左，下标从尾巴往前。
 * - 前序 + 后序能还原的前提是没有空缺歧义，一般还要中序。
 * - 值有重复就不能用 map 定位，题目保证不重复。
 *
 * ——— 常见追问 ———
 * Q: 为什么必须先建左再右？
 * A: 前序是根-左-右。pre++ 先消耗左子树那段，再轮到右。反了会拿错根。
 *
 * Q: map 干什么？
 * A: 中序里找根的位置，O(1)。每次 indexOf 会退化成 O(n²)。
 *
 * Q: 区间 l>r？
 * A: 空子树。比如没有左孩子，根在中序最左边。
 *
 * Q: 只要前序不要中序？
 * A: 不知道左子树有多长，切不开。
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
  const idx = new Map();
  inorder.forEach((v, i) => idx.set(v, i));
  let pre = 0;
  const build = (l, r) => {
    if (l > r) return null; // 区间空，没有这棵子树
    const val = preorder[pre++];
    const node = new TreeNode(val);
    const m = idx.get(val); // 中序里根的位置，左边就是左子树
    node.left = build(l, m - 1);  // 先左后右，配合 pre 递增
    node.right = build(m + 1, r);
    return node;
  };
  return build(0, inorder.length - 1);
}

// —— 自测 ——
console.log(inorderTraversal(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]))); // 期望输出 [9,3,15,20,7]
console.log(inorderTraversal(buildTree([-1], [-1]))); // 期望输出 [-1]

module.exports = { buildTree, TreeNode, build };
