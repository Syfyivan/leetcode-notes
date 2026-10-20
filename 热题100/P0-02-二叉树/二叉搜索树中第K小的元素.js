/**
 * 热题 100 · 二叉搜索树中第K小的元素
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 二叉搜索树中第K小的元素（LC230）
 *
 * 给定一个二叉搜索树的根节点 root ，和一个整数 k ，
 * 请你设计一个算法查找其中第 k 个最小元素（从 1 开始计数）。
 *
 * 思路：
 * 1. BST 里找第 k 小（1 起）。
 * 2. 中序正好升序，边走边计数，数到 k 就记下。
 * 3. 找到后提前停。k 保证合法。
 * 复杂度：时间 O(h+k)，空间 O(h)
 *
 * ——— 示例 ———
 * 输入： root = [3,1,4,null,2], k = 1
 * 输出： 1
 *
 * 输入： root = [5,3,6,2,4,null,null,1], k = 3
 * 输出： 3
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
 * @param {number} k
 * @return {number}
 */
function kthSmallest(root, k) {
  let ans = 0;
  const dfs = (node) => {
    if (!node || k === 0) return; // 找到就剪枝，右边不用走
    dfs(node.left);
    if (--k === 0) {
      ans = node.val; // 中序第 k 个
      return;
    }
    dfs(node.right);
  };
  dfs(root);
  return ans;
}

/**
 * 延伸 1：查找第 k 大
 *
 * 需求：利用 BST 的逆中序顺序，从大到小计数。
 *
 * 思路：显式栈沿右链入栈，弹出一个计数一次，再转向左子树。
 *
 * ——— 示例 ———
 * 示例：BST [3,1,4,null,2]，k=2，返回 3。
 *
 * 复杂度：时间 O(h+k)，空间 O(h)。
 */
function kthLargest(root, k) {
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.right;
    }
    node = stack.pop();
    if (--k === 0) return node.val;
    node = node.left;
  }
  return undefined;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么中序？
 * A: BST 中序正好升序，第 k 个就是第 k 小。
 *
 * Q: 找到后还继续走吗？
 * A: dfs 入口判断 k===0 直接 return，右边不再搜。
 *
 * Q: 时间为什么是 O(h+k) 不是 O(n)？
 * A: 先下到最左 O(h)，再弹出 k 个。最坏还是 O(n)。
 *
 * Q: 有重复值？
 * A: 题目 BST 通常左 < 根 < 右。有重复要先问清定义。
 */

// —— 自测 ——
console.log(kthSmallest(build([3, 1, 4, null, 2]), 1)); // 期望输出 1
console.log(kthSmallest(build([5, 3, 6, 2, 4, null, null, 1]), 3)); // 期望输出 3

module.exports = { kthSmallest, kthLargest, TreeNode, build };
