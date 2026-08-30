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
 *
 * ——— 延伸 ———
 * - Date 比 getTime，RegExp 比 source + flags，Map / Set 转数组再递归。
 * - 循环引用要带 WeakMap，两边同时走过的配对记下来，见过就当相等。
 * - lodash.isEqual 还处理包装对象、typed array；+0 / -0 它当相等。
 *
 * ——— 常见追问 ———
 * Q: 为什么用 Object.is 不用 ===？
 * A: NaN === NaN 是 false，两个空数字会误判成变了。Object.is(NaN, NaN) 是 true。
 *    +0 和 -0 会被 Object.is 判成不等，一般题目不卡。
 *
 * Q: 为什么先比 keys 长度？
 * A: {a:1} 和 {a:1, b:2} 长度不同直接 false。漏掉这步只按 a 的键去 b 里找，会误判。
 *
 * Q: 为什么还要 hasOwnProperty？
 * A: 只遍历了 keysA。a 有 y、b 自有键是 x/z、原型上刚好有 y，长度一样。
 *    不查自有键就会借原型判等，漏掉 z。
 *
 * Q: {0:1, length:1} 和 [1] 相等吗？
 * A: 不相等。Array.isArray 一边 true 一边 false，直接 false。
 *
 * Q: 循环引用会怎样？
 * A: 这版会爆栈。WeakMap 记下 a→b 的配对，再次碰到这对就返回 true。
 */

function isEqual(a, b) {
  if (Object.is(a, b)) return true; // NaN 对 NaN 是 true，=== 做不到
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false; // [1] 和 {0:1} 结构像，类型不同
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false; // 漏掉会把多出来的键当看不见
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false; // 必须是 b 的自有键，别借原型
    if (!isEqual(a[key], b[key])) return false;
  }
  return true;
}

// —— 自测 ——
console.log(isEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })); // true
console.log(isEqual({ a: 1 }, { a: 1, b: 2 }));                 // false
console.log(isEqual(NaN, NaN));                                 // true

module.exports = { isEqual };
