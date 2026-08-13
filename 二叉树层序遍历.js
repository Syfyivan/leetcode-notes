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
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(root == null) {
        return [];
    }
    const res = [];
    const dfs = (node, depth) => {
        if(!node) {
            return;
        }
        if(!res[depth]) {
            res[depth] = [];    
        }
        
        res[depth].push(node.val);
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
    dfs(root, 0);
    return res;
};