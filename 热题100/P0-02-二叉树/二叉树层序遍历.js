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