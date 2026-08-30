/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
 * 思路：
 * 1. 判断是不是镜像对称。
 * 2. 递归比两棵子树：左的左对右的右，左的右对右的左。
 * 3. 都空为真，一个空或值不同为假。
 * 复杂度：时间 O(n)，空间 O(h)
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if(root == null) {
        return true;
    }

    const isMirror = (node1, node2) => {
        if(node1 == null && node2 == null) {
            return true;
        }

        if(node1 == null || node2 == null || node1.val !== node2.val) {
            return false;
        }

        // 外侧对外侧，内侧对内侧
        return isMirror(node1.left, node2.right) && isMirror(node1.right, node2.left)
    }

    return isMirror(root.left, root.right);
};