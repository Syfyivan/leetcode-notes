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
 */

function flatten(arr, depth = 1) {
  const res = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      res.push(...flatten(item, depth - 1));
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
