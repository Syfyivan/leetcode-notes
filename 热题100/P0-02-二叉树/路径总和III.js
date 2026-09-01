/**
 * 热题 100 · 路径总和III
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 路径总和 III（LC437）
 *
 * 给定一个二叉树的根节点 root ，和一个整数 targetSum ，
 * 求该二叉树里节点值之和等于 targetSum 的路径的数目。
 * 路径不需要从根节点开始，也不需要在叶子节点结束，
 * 但是路径方向必须是向下的（只能从父节点到子节点）。
 *
 * 思路：
 * 1. 向下的路径有多少条节点值和等于 targetSum，起点任意。
 * 2. 前缀和：走到当前节点时，前缀和 - target 在 map 里出现几次就多几条。
 * 3. 回溯时把当前前缀和减回去。空树返回 0。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 * 输出： 3
 *
 * 输入： root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
 * 输出： 3
 *
 * ——— 延伸 ———
 * - 路径总和 I：只能从根到叶。dfs 减目标值，到叶子刚好 0。
 * - 路径总和 II：把路径数组带下去，回溯 push/pop。
 * - 前缀和这招跟「和为 K 的子数组」同一思路，只是树要回溯。
 *
 * ——— 常见追问 ———
 * Q: 为什么 map 先放 0:1？
 * A: 从根到当前刚好等于 target 时，prefix - target = 0。没有 0 这条会漏。
 *
 * Q: 回溯为什么减回去？
 * A: 前缀和只对当前路径有效。不删会算到兄弟分支上，多算。
 *
 * Q: 路径能拐弯吗？
 * A: 不能。只能向下。所以前缀和沿一条根到当前的链。
 *
 * Q: 节点有负数？
 * A: 前缀和照样能用。同一前缀可能出现多次，map 记次数。
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
 * @param {number} targetSum
 * @return {number}
 */
function pathSum(root, targetSum) {
  const map = new Map();
  map.set(0, 1); // 从根出发刚好等于 target
  const dfs = (node, prefix) => {
    if (!node) return 0;
    prefix += node.val;
    let cnt = map.get(prefix - targetSum) || 0; // 前面有几个点，到这里刚好差 target
    map.set(prefix, (map.get(prefix) || 0) + 1);
    cnt += dfs(node.left, prefix) + dfs(node.right, prefix);
    map.set(prefix, map.get(prefix) - 1); // 回溯，别污染兄弟分支
    return cnt;
  };
  return dfs(root, 0);
}

/**
 * 延伸 1：根到叶路径总和（LeetCode 112）
 *
 * 需求：判断是否存在一条从根节点到叶节点的路径，节点和等于 targetSum。
 *
 * 思路：向下递归时减去当前值；只有到叶子且剩余值等于叶子值才成功。
 *
 * ——— 示例 ———
 * 示例：[5,4,8,11,null,13,4,7,2]，target=22，返回 true。
 *
 * 复杂度：时间 O(n)，递归栈 O(h)。
 */
function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  const rest = targetSum - root.val;
  return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}

// —— 自测 ——
console.log(pathSum(build([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8)); // 期望输出 3
console.log(pathSum(build([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22)); // 期望输出 3

module.exports = { pathSum, hasPathSum, TreeNode, build };
