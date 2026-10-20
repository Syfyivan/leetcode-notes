/**
 * 热题 100 · 翻转二叉树
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
 * 1. 左右子树对调，子树内部也要对调。
 * 2. 递归：先翻左右，再交换两个孩子指针。
 * 3. 空节点必须 return null，写成 return 会把孩子变成 undefined。
 * 复杂度：时间 O(n)，空间 O(h)
 *
 * ——— 示例 ———
 * 输入：[4,2,7,1,3,6,9]
 * 输出：[4,7,2,9,6,3,1]
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

/**
 * 延伸 1：队列迭代版
 *
 * 需求：不用递归，逐个交换所有节点的左右孩子。
 *
 * 思路：根节点入队；弹出时交换 left/right，再把非空孩子入队。
 *
 * ——— 示例 ———
 * 示例：[2,1,3] 翻转为 [2,3,1]。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function invertTreeIterative(root) {
  if (!root) return null;
  const queue = [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    [node.left, node.right] = [node.right, node.left];
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return root;
}

/**
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

// —— 自测 ——
const invertSample = { val: 2, left: { val: 1 }, right: { val: 3 } };
console.log(invertTree(invertSample).left.val); // 3

module.exports = { invertTree, invertTreeIterative };
