/**
 * 热题 100 · 二叉树的直径
 *
 * 优先级：Hot 100 · P0
 */

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
 *
 * ——— 示例 ———
 * 输入：[1,2,3,4,5]
 * 输出：3（路径 4→2→1→3 或 5→2→1→3）
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
        res = Math.max(res, left + right); // 经过当前节点的边数，直径不一定过根
        return Math.max(left, right); // 向上只交高度，父节点再拼另一边
    }
    dfs(root);
    return res;

};

/**
 * 延伸 1：同时返回高度和直径
 *
 * 需求：把后序递归中“向上返回”和“全局答案”两个量显式交给调用方。
 *
 * 思路：每个节点返回 height；直径候选是 left.height + right.height。
 *
 * ——— 示例 ———
 * 示例：单节点返回 {height:1, diameter:0}。
 *
 * 复杂度：时间 O(n)，空间 O(h)。
 */
function getTreeMetrics(root) {
  function visit(node) {
    if (!node) return { height: 0, diameter: 0 };
    const left = visit(node.left);
    const right = visit(node.right);
    return {
      height: Math.max(left.height, right.height) + 1,
      diameter: Math.max(left.diameter, right.diameter, left.height + right.height),
    };
  }
  return visit(root);
}

/**
 * ——— 常见追问 ———
 * Q: 空孩子为什么返回 -1？
 * A: 叶子左右都 +1 后高度才是 0。返回 0 的话叶子高度变成 1，边数会多算。
 *
 * Q: 直径一定过根吗？
 * A: 不一定。可能整条都在某棵子树里，所以每个节点都要更新全局 res。
 *
 * Q: 返回值跟 res 啥区别？
 * A: 返回的是高度，给父节点用。res 才是直径。
 *
 * Q: 时间？
 * A: 后序一遍 O(n)，栈 O(h)。
 */

// —— 自测 ——
const diameterTree = { val: 1, left: { val: 2, left: { val: 4 }, right: { val: 5 } }, right: { val: 3 } };
console.log(diameterOfBinaryTree(diameterTree)); // 3

module.exports = { diameterOfBinaryTree, getTreeMetrics };
