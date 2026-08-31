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

/**
 * 延伸 1：循环引用 + Date / RegExp / Map / Set
 *
 * 需求：比较常见内建对象，并保证循环结构不会递归爆栈。
 *
 * 思路：
 * 1. WeakMap 记录 a 曾和哪个 b 配对。再次遇到 a 时，只有仍配到同一个 b 才算一致。
 * 2. Date 比时间戳，RegExp 比 source 和 flags。
 * 3. Map 按 key 的 SameValueZero 规则查找，再递归比较 value；Set 按成员身份比较。
 * 4. 普通对象还要比较 prototype、Reflect.ownKeys 和每个属性值。
 *
 * ——— 示例 ———
 * 输入：a.self=a，b.self=b，isEqualComplete(a,b)
 * 输出：true
 */
function isEqualComplete(a, b, seen = new WeakMap()) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);

  if (a instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp) return a.source === b.source && a.flags === b.flags;
  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      if (!b.has(key) || !isEqualComplete(value, b.get(key), seen)) return false;
    }
    return true;
  }
  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    for (const value of a) if (!b.has(value)) return false;
    return true;
  }
  if (ArrayBuffer.isView(a)) {
    if (a.byteLength !== b.byteLength) return false;
    const left = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    const right = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
    return left.every((value, index) => value === right[index]);
  }

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isEqualComplete(a[key], b[key], seen)) return false;
  }
  return true;
}

/**
 * 延伸 2：自定义比较器
 *
 * 需求：某些字段需要业务规则，例如忽略 updatedAt，或把 0.1 + 0.2 与 0.3 视为近似相等。
 * customizer 返回 true / false 时直接采用；返回 undefined 时继续默认深比较。
 *
 * ——— 示例 ———
 * 输入：isEqualWith({n:0.3}, {n:0.30001}, (a,b) => 数字时比较误差)
 * 输出：可按业务阈值返回 true
 */
function isEqualWith(a, b, customizer, path = [], seen = new WeakMap()) {
  const decision = customizer(a, b, path);
  if (decision !== undefined) return Boolean(decision);
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);
  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) =>
    Object.prototype.hasOwnProperty.call(b, key)
    && isEqualWith(a[key], b[key], customizer, path.concat(key), seen)
  );
}

// —— 自测 ——
console.log(isEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })); // true
console.log(isEqual({ a: 1 }, { a: 1, b: 2 }));                 // false
console.log(isEqual(NaN, NaN));                                 // true

module.exports = { isEqual, isEqualComplete, isEqualWith };
