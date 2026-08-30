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
 *
 * ——— 延伸 ———
 * - 迭代：队列/栈把节点扔进去，弹出就交换左右孩子。
 * - 只翻值不换指针过不了，结构也要镜像。
 * - 对称二叉树就是「左树翻转后跟右树一样」。
 *
 * ——— 常见追问 ———
 * Q: 为什么空节点要 return null，写成 return 不行？
 * A: return 是 undefined。父节点会把孩子写成 undefined，后面再访 left 会炸。
 *
 * Q: 先翻再换，能不能先换再翻？
 * A: 能。先交换指针，再 invert(left)、invert(right)。别用已经改过的指针翻错边。
 *
 * Q: 时间？
 * A: 每个节点换一次 O(n)，栈 O(h)。
 *
 * Q: 单节点 / 空树？
 * A: 空返回 null。单节点左右都空，换完还是自己。
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(root == null) {
        return null; // 必须返回 null，写成 return 会变成 undefined
    }
    let tmp = invertTree(root.right); // 先翻两边，再用 tmp 换，避免覆盖
    root.right = invertTree(root.left);
    root.left = tmp;
    return root;
};