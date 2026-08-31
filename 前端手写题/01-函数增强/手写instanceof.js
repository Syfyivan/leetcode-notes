/**
 * 手写 instanceof
 *
 * 优先级：前端 P1 · 全栈 P2
 *
 * 需求：实现 myInstanceof(obj, Ctor)，判断 Ctor.prototype 是否
 *       出现在 obj 的原型链上。基本类型直接返回 false。
 *
 * 思路：
 * 1. 从 obj 的原型一路往上找，碰到 Ctor.prototype 就是 true。
 * 2. 基本类型、null 没有可走的链，直接 false。
 * 3. 用 Object.getPrototypeOf，走到 null 就停。
 *
 * ——— 示例 ———
 * 输入： myInstanceof([], Array)
 * 输出： true
 *
 * 输入： myInstanceof([], Object)
 * 输出： true       （Array 继承自 Object）
 *
 * 输入： myInstanceof(1, Number)
 * 输出： false      （基本类型不在原型链上）
 *
 * ——— 常见追问 ———
 * Q: 为什么 1 instanceof Number 是 false？
 * A: instanceof 只认对象。1 是基本类型，没有原型链。new Number(1) 才是 true。
 *
 * Q: 和 typeof 怎么分工？
 * A: typeof 分基本类型，对象一律 'object'（函数除外）。instanceof 沿原型链认构造函数。
 *
 * Q: 为什么用 Object.getPrototypeOf 不用 obj.__proto__？
 * A: __proto__ 是历史遗物，还可能被改掉。getPrototypeOf 读的是真正的 [[Prototype]]。
 *
 * Q: 右边不是函数怎么办？
 * A: 原生抛 TypeError。手写如果 Ctor.prototype 取不到也会出问题，面试提一句即可。
 *
 * Q: 原型链成环会怎样？
 * A: while 死循环。规范禁止成环，手写可加个 Set 记住走过的 proto。
 */

function myInstanceof(obj, Ctor) {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false; // 基本类型没有原型链；函数也是对象，得放行
  }
  const prototype = Ctor.prototype;
  let proto = Object.getPrototypeOf(obj);
  while (proto) { // Object.prototype 的原型是 null，到这就停
    if (proto === prototype) return true; // 必须同一引用，跨 iframe 的 Array 对不上
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

/**
 * 延伸 1：补上右值校验和 Symbol.hasInstance
 *
 * 需求：更接近原生 instanceof：
 *   - 右值不是对象时抛 TypeError；
 *   - 右值定义了 Symbol.hasInstance 时，优先交给它判断；
 *   - 普通函数仍沿原型链查找。
 *
 * 思路：
 * 1. 先校验 Ctor，避免读 null.prototype 时报出含糊错误。
 * 2. 自有的 Symbol.hasInstance 可完全接管规则。
 * 3. 默认 Function.prototype[Symbol.hasInstance] 不能直接调用本函数，否则会递归；
 *    没有自定义规则时继续手动走原型链。
 *
 * ——— 示例 ———
 * 输入：instanceOf(4, { [Symbol.hasInstance]: x => Number.isInteger(x) })
 * 输出：true
 */
function instanceOf(value, Ctor) {
  const type = typeof Ctor;
  if (Ctor == null || (type !== 'object' && type !== 'function')) {
    throw new TypeError('instanceof 右值必须是对象');
  }

  const hasInstance = Ctor[Symbol.hasInstance];
  const isDefaultFunctionRule = typeof Ctor === 'function'
    && hasInstance === Function.prototype[Symbol.hasInstance];
  if (hasInstance !== undefined && !isDefaultFunctionRule) {
    if (typeof hasInstance !== 'function') {
      throw new TypeError('Symbol.hasInstance 必须是函数');
    }
    return Boolean(hasInstance.call(Ctor, value));
  }
  if (typeof Ctor !== 'function') {
    throw new TypeError('右值不可调用且未实现 Symbol.hasInstance');
  }
  if (typeof Ctor.prototype !== 'object' || Ctor.prototype === null) {
    throw new TypeError('构造函数 prototype 必须是对象');
  }
  return myInstanceof(value, Ctor);
}

/**
 * 延伸 2：防御被代理对象制造的原型环
 *
 * 需求：普通对象的原型链按规范不会成环，但 Proxy 的 getPrototypeOf 可以返回异常结构。
 *       面试里若要求健壮性，可以用 Set 防止循环卡死。
 *
 * 思路：每走到一个 proto 就记入 visited，再次遇到同一引用时返回 false。
 */
function myInstanceofSafe(obj, Ctor) {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) return false;
  const visited = new Set();
  let proto = Object.getPrototypeOf(obj);
  while (proto && !visited.has(proto)) {
    if (proto === Ctor.prototype) return true;
    visited.add(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// —— 自测 ——
console.log(myInstanceof([], Array));  // true
console.log(myInstanceof([], Object)); // true
console.log(myInstanceof(1, Number));  // false
console.log(instanceOf(4, { [Symbol.hasInstance]: (x) => Number.isInteger(x) })); // true

module.exports = { myInstanceof, instanceOf, myInstanceofSafe };
