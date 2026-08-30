/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
 * 思路：
 * 1. 任意两节点间最长路径的边数。
 * 2. 后序算高度，经过该节点的直径 = 左高 + 右高，全局取 max。
 * 3. 空树直径 0。空孩子返回 -1，加 1 后叶子高度为 0。
 * 复杂度：时间 O(n)，空间 O(h)
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
            return -1; // 空孩子高度 -1，叶子 +1 后高度为 0
        }
        const left = dfs(node.left) + 1;
        const right = dfs(node.right) + 1;
        res = Math.max(res, left + right);
        return Math.max(left, right);
    }
    dfs(root);
    return res;

};