/**
 * 数组扁平化（手写 flat）
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 输入：可能嵌套多层的数组，以及可选的展开深度（默认 1，Infinity 表示全展开）。
 * 输出：按深度展开后的新数组。
 *
 * 思路：
 * 1. 遍历每一项，是数组且 depth > 0 就递归展开。
 * 2. depth 默认 1。每往里走一层减 1，Infinity 减完还是 Infinity。
 * 3. 非数组原样推进结果。
 *
 * ——— 示例 ———
 * 输入： [1, [2, [3, [4]]]]              输出： [1, 2, [3, [4]]]   （默认深度 1）
 * 输入： [1, [2, [3, [4]]]], 深度 2       输出： [1, 2, 3, [4]]
 * 输入： [1, [2, [3, [4]]]], 深度 Infinity 输出： [1, 2, 3, 4]
 *
 * ——— 延伸 ———
 * - 迭代栈：倒着压栈，弹出来才是从左到右。
 * - reduce + concat 一行版只能拍一层，浅层面试能写。
 * - 稀疏数组：for...of 会跳过空位。要保留 hole 就用下标 for。
 *
 * ——— 常见追问 ———
 * Q: 为什么 depth 默认 1？
 * A: 跟 Array.prototype.flat() 对齐。不传只拍一层。
 *
 * Q: Infinity - 1 还是 Infinity 吗？
 * A: 是。全展开传 Infinity 就行，不用自己写循环。
 *
 * Q: 为什么用 Array.isArray，不用 instanceof？
 * A: instanceof Array 跨 iframe 会失败，那边的数组原型不是这边的 Array。
 *
 * Q: [1, , 3] 会怎样？
 * A: for...of 把空位跳过，结果少一项。下标遍历才能留下 hole。
 *
 * Q: concat 能代替吗？
 * A: concat 只拍一层。多层还是得递归或栈。
 */

function flatten(arr, depth = 1) {
  const res = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      res.push(...flatten(item, depth - 1)); // Infinity-1 还是 Infinity，全展开靠这个
    } else {
      res.push(item);
    }
  }
  return res;
}

// —— 自测 ——
console.log(flatten([1, [2, [3, [4]]]]));            // [1, 2, [3, [4]]]
console.log(flatten([1, [2, [3, [4]]]], 2));         // [1, 2, 3, [4]]
console.log(flatten([1, [2, [3, [4]]]], Infinity));  // [1, 2, 3, 4]

module.exports = { flatten };
