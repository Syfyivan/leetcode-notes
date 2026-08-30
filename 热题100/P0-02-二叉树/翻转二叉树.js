/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
 * 思路：
 * 1. 左右子树对调，子树内部也要对调。
 * 2. 递归：先翻左右，再交换两个孩子指针。
 * 3. 空节点必须 return null，写成 return 会把孩子变成 undefined。
 * 复杂度：时间 O(n)，空间 O(h)
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(root == null) {
        return null;
    }
    let tmp = invertTree(root.right);
    root.right = invertTree(root.left);
    root.left = tmp;
    return root;
};