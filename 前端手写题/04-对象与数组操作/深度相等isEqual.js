/**
 * 深度相等判断 isEqual
 *
 * 优先级：前端 P1 · 全栈 P2
 *
 * 需求：实现 isEqual(a, b)，递归比较两个值是否"结构相等"：
 *   - 基本类型用值比较（可用 Object.is 处理 NaN）；
 *   - 数组 / 纯对象逐键递归比较，键数量和每个键的值都要一致；
 *   - 类型不同直接 false。
 *   常用于 React shouldComponentUpdate、表单变更检测。
 *
 * 思路：
 * 1. 先用 Object.is 比，NaN 和 NaN 会相等。
 * 2. 有一边不是对象或是 null，直接 false。一个数组一个对象也 false。
 * 3. 键数量要一样，再逐个键递归。
 * 4. 边界 / 易错：用 == 的话 NaN 对不上；漏掉键数量，{a:1} 和 {a:1,b:2} 会误判成相等。
 *
 * ——— 示例 ———
 * 输入： isEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })
 * 输出： true
 *
 * 输入： isEqual({ a: 1 }, { a: 1, b: 2 })
 * 输出： false
 */

function isEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }
  return true;
}

// —— 自测 ——
console.log(isEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })); // true
console.log(isEqual({ a: 1 }, { a: 1, b: 2 }));                 // false
console.log(isEqual(NaN, NaN));                                 // true

module.exports = { isEqual };
