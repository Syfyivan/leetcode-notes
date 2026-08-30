/**
 * 二叉树的右视图（LC199）
 *
 * 给定一个二叉树的根节点 root ，想象自己站在它的右侧，
 * 按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
 *
 * 思路：
 * 1. 从右边看，每层只看到最右那个节点。
 * 2. BFS 层序，每层最后一个入答案。
 * 3. 空树返回 []。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： root = [1,2,3,null,5,null,4]
 * 输出： [1,3,4]
 *
 * 输入： root = [1,null,3]
 * 输出： [1,3]
 *
 * 输入： root = []
 * 输出： []
 *
 * ——— 延伸 ———
 * - DFS：先右后左，每层第一次碰到的就是最右。比 BFS 少一个队列。
 * - 左视图：每层第一个，或 DFS 先左后右。
 * - 层序遍历骨架一样，只是每层只留最后一个。
 *
 * ——— 常见追问 ———
 * Q: 为什么每层最后一个就是右视图？
 * A: 层序从左往右入队，队尾就是这层最右，站在右边能看见的那个。
 *
 * Q: 左子树比右子树深？
 * A: 更深的那些层没有右边挡着，左子树的节点会入答案。例：[1,2] 右视图是 [1,2]。
 *
 * Q: 空树？
 * A: 直接 []。
 *
 * Q: BFS 空间？
 * A: 最宽一层 O(n)。DFS 是 O(h)。
 */

function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
// 用层序数组建树（null 表示空节点），方便自测
function build(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
function rightSideView(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.length; // 先拍板本层人数，循环中还会往队尾加下一层
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      if (i === n - 1) res.push(node.val); // 本层最后一个就是右视图
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return res;
}

// —— 自测 ——
console.log(rightSideView(build([1, 2, 3, null, 5, null, 4]))); // 期望输出 [1,3,4]
console.log(rightSideView(build([1, null, 3]))); // 期望输出 [1,3]
console.log(rightSideView(build([]))); // 期望输出 []

module.exports = { rightSideView, TreeNode, build };
