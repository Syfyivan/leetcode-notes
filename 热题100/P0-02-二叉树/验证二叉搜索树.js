/**
 * 热题 100 · 验证二叉搜索树
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
 * 1. 判断是不是 BST：整棵树左 < 根 < 右。
 * 2. 递归带上下界，左子树上界是当前值，右子树下界是当前值。
 * 3. 只比直接孩子会漏掉更深层。空树是 BST。相等也不合法。
 * 复杂度：时间 O(n)，空间 O(h)
 *
 * ——— 示例 ———
 * 输入：[2,1,3]  输出：true
 * 输入：[5,1,4,null,null,3,6]  输出：false
 *
 * ——— 延伸 ———
 * - 中序遍历，看是不是严格递增。前一个值记下来，当前 <= 前一个就挂。
 * - 只比直接孩子会漏：右孩子的左孙可能比根小。
 * - 允许相等的话改成 < min 或 > max，先问清题目。
 *
 * ——— 常见追问 ———
 * Q: 为什么要带 min/max，不能只比左右孩子？
 * A: BST 要求整棵左子树都 < 根。只比孩子，深层会漏。
 *
 * Q: 下界上界怎么传？
 * A: 往左走，上界收成当前值；往右走，下界抬成当前值。根起步是 ±Infinity。
 *
 * Q: 相等算不算 BST？
 * A: 这题严格 <。<= min 或 >= max 都 false。
 *
 * Q: 空树？
 * A: 空是 BST，返回 true。
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
    const dfs = (node, min, max) => {
        if (node == null) return true; // 空树是 BST
        if (node.val <= min || node.val >= max) return false; // 等于也不行
        return dfs(node.left, min, node.val) && dfs(node.right, node.val, max); // 往左收上界，往右抬下界
    };
    return dfs(root, -Infinity, Infinity);
};

/**
 * 延伸 1：中序严格递增校验
 *
 * 需求：用 BST 中序有序性质判断整棵树，不能只比较父子节点。
 *
 * 思路：迭代中序遍历，当前值必须严格大于前一个访问值。
 *
 * ——— 示例 ———
 * 示例：[2,1,3] 返回 true；[2,2,3] 返回 false。
 *
 * 复杂度：时间 O(n)，空间 O(h)。
 */
function isValidBSTInorder(root) {
  const stack = [];
  let node = root;
  let previous = -Infinity;
  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    if (node.val <= previous) return false;
    previous = node.val;
    node = node.right;
  }
  return true;
}

// —— 自测 ——
console.log(isValidBST({ val: 2, left: { val: 1 }, right: { val: 3 } })); // true

module.exports = { isValidBST, isValidBSTInorder };
