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
 * ——— 示例 ———
 * 输入： isEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })
 * 输出： true
 *
 * 输入： isEqual({ a: 1 }, { a: 1, b: 2 })
 * 输出： false
 */

function isEqual() {
}

// —— 自测 ——
console.log(isEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })); // true
console.log(isEqual({ a: 1 }, { a: 1, b: 2 }));                 // false
console.log(isEqual(NaN, NaN));                                 // true

module.exports = { isEqual };
