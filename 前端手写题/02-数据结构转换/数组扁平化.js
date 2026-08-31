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
 * A: 原生 flat 会移除被遍历层级里的空位。for...of 实际会读出 undefined，
 *    所以要用下标并配合 `i in arr` 才能跳过 hole。
 *
 * Q: concat 能代替吗？
 * A: concat 只拍一层。多层还是得递归或栈。
 */

function flatten(arr, depth = 1) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr)) continue; // 对齐原生 flat：移除当前遍历层级里的空位
    const item = arr[i];
    if (Array.isArray(item) && depth > 0) {
      res.push(...flatten(item, depth - 1)); // Infinity-1 还是 Infinity，全展开靠这个
    } else {
      res.push(item);
    }
  }
  return res;
}

/**
 * 延伸 1：迭代栈版本
 *
 * 需求：不用递归，避免嵌套极深时调用栈溢出，并保留指定 depth 的能力。
 *
 * 思路：
 * 1. 栈里同时保存 value 和剩余 depth。
 * 2. 数组需要展开时倒序压入，弹出后才保持原来的从左到右顺序。
 * 3. 下标不存在就跳过，对齐原生 flat 移除空位的规则。
 *
 * ——— 示例 ———
 * 输入：flattenIterative([1, [2, [3]]], 1)
 * 输出：[1, 2, [3]]
 */
function flattenIterative(arr, depth = 1) {
  const maxDepth = depth === Infinity
    ? Infinity
    : Math.max(0, Math.floor(Number(depth) || 0));
  const result = [];
  const stack = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    if (i in arr) stack.push({ value: arr[i], depth: maxDepth });
  }
  while (stack.length) {
    const current = stack.pop();
    if (Array.isArray(current.value) && current.depth > 0) {
      for (let i = current.value.length - 1; i >= 0; i--) {
        if (i in current.value) {
          stack.push({ value: current.value[i], depth: current.depth - 1 });
        }
      }
    } else {
      result.push(current.value);
    }
  }
  return result;
}

/**
 * 延伸 2：reduce + concat 拍一层
 *
 * 需求：题目明确只展开一层时，可以用数组归并写出最短版本。
 *
 * 思路：concat 遇到数组会展开一层，遇到普通值直接追加。它不会继续递归。
 *
 * ——— 示例 ———
 * 输入：flattenOneLevel([1, [2, [3]]])
 * 输出：[1, 2, [3]]
 */
function flattenOneLevel(arr) {
  return arr.reduce((result, item) => result.concat(item), []);
}

// —— 自测 ——
console.log(flatten([1, [2, [3, [4]]]]));            // [1, 2, [3, [4]]]
console.log(flatten([1, [2, [3, [4]]]], 2));         // [1, 2, 3, [4]]
console.log(flatten([1, [2, [3, [4]]]], Infinity));  // [1, 2, 3, 4]

module.exports = { flatten, flattenIterative, flattenOneLevel };
