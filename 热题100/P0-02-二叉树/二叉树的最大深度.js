/**
 * 热题 100 · 二叉树的最大深度
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
 * 1. 根到最深叶子有几层。
 * 2. 后序：深度 = 1 + max(左深度, 右深度)。
 * 3. 空树深度 0。
 * 复杂度：时间 O(n)，空间 O(h)
 *
 * ——— 示例 ———
 * 输入：[3,9,20,null,null,15,7]  输出：3
 * 输入：[]  输出：0
 *
 * ——— 延伸 ———
 * - 迭代层序：每过一层 depth++，层数就是深度。
 * - 最小深度（LC111）：叶子才结算，一边空不能当 0 取 min，否则根只有左孩子会算成 1。
 * - 直径、平衡树都要先会算深度。
 *
 * ——— 常见追问 ———
 * Q: 空树为什么返回 0？
 * A: 题目要节点层数。空没有节点。算直径时才会用 -1 让叶子高度为 0。
 *
 * Q: 一边空？
 * A: max(左, 右)，空返回 0，深度等于有孩子那边 + 1。
 *
 * Q: 时间空间？
 * A: 每个节点一次 O(n)。递归栈 O(h)，偏斜 O(n)。
 *
 * Q: 跟高度什么关系？
 * A: 这题深度按节点数算，根是 1。有的题高度按边数，叶子是 0。
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if (root == null) return 0; // 空树没有节点
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};

/**
 * 延伸 1：BFS 层序计数
 *
 * 需求：用迭代方式计算层数，避免极深树造成递归栈溢出。
 *
 * 思路：每轮固定处理当前 queue 的节点数；处理完一层 depth 加一。
 *
 * ——— 示例 ———
 * 示例：[3,9,20,null,null,15,7] 返回 3。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function maxDepthBFS(root) {
  if (!root) return 0;
  const queue = [root];
  let head = 0;
  let depth = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    depth++;
  }
  return depth;
}

// —— 自测 ——
console.log(maxDepth({ val: 1, left: { val: 2 }, right: null })); // 2

module.exports = { maxDepth, maxDepthBFS };
