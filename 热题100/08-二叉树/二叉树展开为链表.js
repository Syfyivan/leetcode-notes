/**
 * 二叉树展开为链表（LC114）
 *
 * 给你二叉树的根结点 root ，请你将它展开为一个单链表：
 * 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，
 * 而左子指针 left 始终为 null 。
 * 展开后的单链表应该与二叉树 先序遍历 顺序相同。
 *
 * ——— 示例 ———
 * 输入： root = [1,2,5,3,4,null,6]
 * 输出： [1,null,2,null,3,null,4,null,5,null,6]
 *
 * 输入： root = []
 * 输出： []
 *
 * 输入： root = [0]
 * 输出： [0]
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

// 沿 right 指针收集节点值，方便验证展开结果
function collectRight(root) {
  const res = [];
  let cur = root;
  while (cur) {
    res.push(cur.val);
    cur = cur.right;
  }
  return res;
}

/**
 * @param {TreeNode} root
 * @return {void} 不返回任何东西，原地修改 root
 */
function flatten(root) {
  // TODO
}

// —— 自测 ——
const t1 = build([1, 2, 5, 3, 4, null, 6]);
flatten(t1);
console.log(collectRight(t1)); // 期望输出 [1,2,3,4,5,6]

const t2 = build([0]);
flatten(t2);
console.log(collectRight(t2)); // 期望输出 [0]

module.exports = { flatten, TreeNode, build };
