/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
 * 思路：
 * 1. 判断是不是 BST：整棵树左 < 根 < 右。
 * 2. 递归带上下界，左子树上界是当前值，右子树下界是当前值。
 * 3. 只比直接孩子会漏掉更深层。空树是 BST。相等也不合法。
 * 复杂度：时间 O(n)，空间 O(h)
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
    const dfs = (node, min, max) => {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);
    };
    return dfs(root, -Infinity, Infinity);
};