/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
 * 思路：
 * 1. 按层收集节点值，一层一个数组。
 * 2. DFS 带 depth，res[depth] 不存在就先建空数组。
 * 3. 空树返回 []。
 * 复杂度：时间 O(n)，空间 O(n)
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
            res[depth] = []; // 第一次走到这一层才建数组
        }
        
        res[depth].push(node.val);
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
    dfs(root, 0);
    return res;
};