/**
 * 热题 100 · 二叉树层序遍历
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
 * 1. 按层收集节点值，一层一个数组。
 * 2. DFS 带 depth，res[depth] 不存在就先建空数组。
 * 3. 空树返回 []。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入：[3,9,20,null,null,15,7]
 * 输出：[[3],[9,20],[15,7]]
 *
 * ——— 延伸 ———
 * - BFS 队列：每层先记下 queue.length，循环这么多次，自然一层一个数组。
 * - 锯齿层序（LC103）：偶数层往结果数组前面插，或这层结束 reverse。
 * - 只返回每层平均值、每层最大值，同一套骨架。
 *
 * ——— 常见追问 ———
 * Q: DFS 带 depth 为什么也能分层？
 * A: 先左后右，同一层按从左到右进 res[depth]。深度当数组下标。
 *
 * Q: 空树？
 * A: 入口直接 []。dfs 里 !node 也 return。
 *
 * Q: 空间？
 * A: 结果 O(n) 必付。DFS 栈 O(h)，BFS 队列最宽一层 O(n)。
 *
 * Q: 为什么第一次走到才建数组？
 * A: 否则 res[depth] 是 undefined，push 会报错。
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(root == null) {
        return []; // 空树没有层
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

/**
 * 延伸 1：锯齿形层序遍历
 *
 * 需求：第一层从左到右，第二层从右到左，之后交替方向。
 *
 * 思路：BFS 骨架不变；奇数层把当前值写到 level 的反向下标。
 *
 * ——— 示例 ———
 * 示例：[3,9,20,null,null,15,7] 输出 [[3],[20,9],[15,7]]。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    const level = new Array(size);
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      level[result.length % 2 === 0 ? i : size - 1 - i] = node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// —— 自测 ——
const levelTree = { val: 1, left: { val: 2 }, right: { val: 3 } };
console.log(levelOrder(levelTree)); // [[1], [2, 3]]

module.exports = { levelOrder, zigzagLevelOrder };
