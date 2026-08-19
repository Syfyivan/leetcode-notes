/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function(root) {
    if(root == null) {
        return 0;
    }
    let res = 0;
    const dfs = (node) => {
        if(node == null) {
            return -1;
        }
        const left = dfs(node.left) + 1;
        const right = dfs(node.right) + 1;
        res = Math.max(res, left + right);
        return Math.max(left, right);
    }
    dfs(root);
    return res;

};