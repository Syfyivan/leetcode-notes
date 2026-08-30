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
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    let res = [];
    var inorder = function(treenode) {
        if(treenode === null) {
        return;
        }
        inorder(treenode.left);   // 左
        res.push(treenode.val);   // 根
        inorder(treenode.right);  // 右
    }
    inorder(root);
    return res;
};