/**
 * 深合并 deepMerge
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 deepMerge(target, source)，递归合并两个对象：
 *   - 两边同名属性都是纯对象时递归合并；
 *   - 否则 source 覆盖 target；
 *   - 常用于合并默认配置和用户配置。
 *
 * ——— 示例 ———
 * 输入： deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 })
 * 输出： { a: 1, b: { x: 1, y: 2 }, c: 3 }
 */

function deepMerge() {
}

// —— 自测 ——
console.log(deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 }));
// { a: 1, b: { x: 1, y: 2 }, c: 3 }

module.exports = { deepMerge };
