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
 * ——— 延伸 ———
 * - 迭代：左一路入栈，弹出来访问，再转向右。面试常要手写栈。
 * - 前序根-左-右、后序左-右-根，递归就换三行顺序。
 * - Morris：用空闲的右指针串前驱，空间 O(1)，会改树要改回来。
 *
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