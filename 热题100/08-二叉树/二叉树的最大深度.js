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
var maxDepth = function(root) {
    let res = 0;
    const maxDepth1 = (node) => {
        if(node === null) {
        return res;
        }
        let leftMax = maxDepth1(node.left);
        let rightMax = maxDepth1(node.right);
        res =  Math.max(leftMax, rightMax) + 1;
    }
    return res;
};