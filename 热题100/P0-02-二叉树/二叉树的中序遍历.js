/**
 * 热题 100 · 二叉树的中序遍历
 *
 * 优先级：Hot 100 · P0
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
 * 思路：
 * 1. 按左-根-右收集节点值。
 * 2. 递归中序。
 * 3. 空节点直接返回。
 * 复杂度：时间 O(n)，空间 O(h)
 *
 * ——— 示例 ———
 * 输入：[1,null,2,3]
 * 输出：[1,3,2]
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    let res = []; // 闭包累加，不能在递归里新建
    var inorder = function(treenode) {
        if(treenode === null) {
        return; // 空没有值
        }
        inorder(treenode.left);   // 左
        res.push(treenode.val);   // 根
        inorder(treenode.right);  // 右
    }
    inorder(root);
    return res;
};

/**
 * 延伸 1：显式栈迭代
 *
 * 需求：不用递归完成“左 → 根 → 右”的遍历。
 *
 * 思路：当前节点沿左链全部入栈；弹栈访问后转向它的右子树。
 *
 * ——— 示例 ———
 * 示例：[1,null,2,3] 输出 [1,3,2]。
 *
 * 复杂度：时间 O(n)，空间 O(h)。
 */
function inorderTraversalIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }
  return result;
}

/**
 * ——— 常见追问 ———
 * Q: 空节点为什么直接 return 不 push？
 * A: 空没有值。push 会进 null，结果脏。
 *
 * Q: 递归空间？
 * A: 栈最深 O(h)，链状退化 O(n)。迭代显式栈同理。
 *
 * Q: 为什么 res 在外面？
 * A: 闭包累加。每层新建数组就拼不起来。
 *
 * Q: 迭代栈里什么时候 push、什么时候 pop？
 * A: 一直往左 push；左空了 pop 访问，再转向右。跟递归展开是同一件事。
 */

// —— 自测 ——
console.log(inorderTraversal({
  val: 1,
  left: null,
  right: { val: 2, left: { val: 3, left: null, right: null }, right: null },
})); // [1,3,2]

module.exports = { inorderTraversal, inorderTraversalIterative };
