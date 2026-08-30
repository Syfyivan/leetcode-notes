/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 *
 * 思路：
 * 1. 升序数组建成高度平衡的 BST。
 * 2. 每次取中点做根，左边建左子树，右边建右子树。
 * 3. 区间空则返回 null。偶数个时中点取左或右都行。
 * 复杂度：时间 O(n)，空间 O(log n)
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
    const build = (l, r) => {
        if (l > r) return null;
        const mid = (l + r) >> 1;
        const node = new TreeNode(nums[mid]);
        node.left = build(l, mid - 1);
        node.right = build(mid + 1, r);
        return node;
    };
    return build(0, nums.length - 1);
};