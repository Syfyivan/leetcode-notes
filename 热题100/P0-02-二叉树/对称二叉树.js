/**
 * 热题 100 · 对称二叉树
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
 * 1. 判断是不是镜像对称。
 * 2. 递归比两棵子树：左的左对右的右，左的右对右的左。
 * 3. 都空为真，一个空或值不同为假。
 * 复杂度：时间 O(n)，空间 O(h)
 *
 * ——— 示例 ———
 * 输入：[1,2,2,3,4,4,3]  输出：true
 * 输入：[1,2,2,null,3,null,3]  输出：false
 *
 * ——— 延伸 ———
 * - 迭代：队列每次拿一对，外侧和外侧比、内侧和内侧比。
 * - 翻转左子树再和右子树比结构+值，额外改树，一般不这么干。
 * - 空树算对称。
 *
 * ——— 常见追问 ———
 * Q: 为什么比的是 node1.left 和 node2.right？
 * A: 镜像是外侧对外侧。左子树的左对右子树的右，左子树的右对右子树的左。
 *
 * Q: 一个空一个不空？
 * A: 不对称，直接 false。两个都空才是 true。
 *
 * Q: 跟「相同的树」差在哪？
 * A: 相同是左对左、右对右。对称把一边左右对调再比。
 *
 * Q: 时间？
 * A: 每对节点看一次 O(n)，栈/队列 O(h)。
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if(root == null) {
        return true;
    }

    const isMirror = (node1, node2) => {
        if(node1 == null && node2 == null) {
            return true; // 一对都空，这侧对齐
        }

        if(node1 == null || node2 == null || node1.val !== node2.val) {
            return false; // 一个空或值不同，镜像破了
        }

        // 外侧对外侧，内侧对内侧
        return isMirror(node1.left, node2.right) && isMirror(node1.right, node2.left)
    }

    return isMirror(root.left, root.right);
};

/**
 * 延伸 1：队列迭代版
 *
 * 需求：不用递归，每次成对比较镜像位置。
 *
 * 思路：依次放入 left.left/right.right 和 left.right/right.left；一空一非空立即失败。
 *
 * ——— 示例 ———
 * 示例：[1,2,2,3,4,4,3] 返回 true。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function isSymmetricIterative(root) {
  if (!root) return true;
  const queue = [root.left, root.right];
  for (let head = 0; head < queue.length; head += 2) {
    const left = queue[head];
    const right = queue[head + 1];
    if (!left && !right) continue;
    if (!left || !right || left.val !== right.val) return false;
    queue.push(left.left, right.right, left.right, right.left);
  }
  return true;
}

// —— 自测 ——
const symmetricTree = { val: 1, left: { val: 2 }, right: { val: 2 } };
console.log(isSymmetric(symmetricTree)); // true

module.exports = { isSymmetric, isSymmetricIterative };
