/**
 * 热题 100 · 有序数组转化成二叉搜索树
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
 * 1. 升序数组建成高度平衡的 BST。
 * 2. 每次取中点做根，左边建左子树，右边建右子树。
 * 3. 区间空则返回 null。偶数个时中点取左或右都行。
 * 复杂度：时间 O(n)，空间 O(log n)
 *
 * ——— 示例 ———
 * 输入：[-10,-3,0,5,9]
 * 输出：一种高度平衡 BST，例如 [0,-3,9,-10,null,5]
 */
function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
    const build = (l, r) => {
        if (l > r) return null; // 区间空了
        const mid = (l + r) >> 1; // 中点做根，左右个数差 ≤ 1
        const node = new TreeNode(nums[mid]);
        node.left = build(l, mid - 1);
        node.right = build(mid + 1, r);
        return node;
    };
    return build(0, nums.length - 1);
};

/**
 * 延伸 1：切片版写法
 *
 * 需求：用最直观的代码展示“中点为根，左右递归”的结构。
 *
 * 思路：每轮取中点，左右 slice 后继续构造；代价是反复复制子数组。
 *
 * ——— 示例 ———
 * 示例：[-10,-3,0,5,9] 的根可取 0，左右子树高度差不超过 1。
 *
 * 复杂度：时间最坏 O(n log n)，切片额外空间 O(n log n)。
 */
function sortedArrayToBSTWithSlice(nums) {
  if (nums.length === 0) return null;
  const middle = Math.floor(nums.length / 2);
  return {
    val: nums[middle],
    left: sortedArrayToBSTWithSlice(nums.slice(0, middle)),
    right: sortedArrayToBSTWithSlice(nums.slice(middle + 1)),
  };
}

/**
 * ——— 常见追问 ———
 * Q: 为什么取中点？
 * A: 左右两边个数差最多 1，高度才平衡。取两端会退化成链。
 *
 * Q: l > r 返回 null？
 * A: 区间空了，没有节点。l===r 时中点就是这个唯一元素。
 *
 * Q: >> 1 会不会溢出？
 * A: JS 位数够这题没事。保险写法 l + ((r-l)>>1)，面试提一句就行。
 *
 * Q: 时间空间？
 * A: 每个元素当一次根 O(n)。递归深度 O(log n)，因为每次对半。
 */

// —— 自测 ——
console.log(sortedArrayToBST([-10, -3, 0, 5, 9]).val); // 0

module.exports = { TreeNode, sortedArrayToBST, sortedArrayToBSTWithSlice };
