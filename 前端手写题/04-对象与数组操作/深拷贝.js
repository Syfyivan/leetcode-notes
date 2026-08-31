/**
 * 深拷贝
 *
 * 优先级：前端 P0 · 全栈 P0
 *
 * 输入：任意值（对象 / 数组 / 原始值，可能存在循环引用）。
 * 输出：一份完全独立的深拷贝，改动拷贝不影响原对象。
 *
 * 思路：
 * 1. 原始值和 null 直接返回。对象先查 WeakMap，见过就返回上次那份拷贝，切断循环。
 * 2. Date / RegExp / Map / Set 各自 new 一份，再拷里面的内容。
 * 3. 普通对象和数组：先建空壳放进 WeakMap，再逐个键递归。空壳要先放，自引用才能绕回来。
 * 4. 边界 / 易错：WeakMap 的 key 必须是对象；函数不拷，原样返回。
 *
 * ——— 示例 ———
 * 输入： const a = { a: 1, b: { c: 2 }, d: [3, 4] };
 *        const b = 深拷贝(a);  b.b.c = 999;
 * 输出： a.b.c === 2      // 原对象不受影响
 *        b.b.c === 999
 *
 * 进阶（循环引用）：
 * 输入： const o = { name: 'self' };  o.self = o;
 * 输出： 深拷贝(o).self.name === 'self'   // 不能爆栈
 *
 * ——— 常见追问 ———
 * Q: 为什么用 WeakMap 不用 Map？
 * A: key 是原对象，WeakMap 不阻止 GC。拷完原对象就能收。Map 会把原对象一直抓住。
 *
 * Q: 为什么空壳要先放进 cache？
 * A: 对象里有自引用。先放空壳，递归回来 cache.get 能拿到正在建的那份，切断循环。
 *
 * Q: 函数为什么不拷？
 * A: 函数一般当共享行为。闭包绑的是原作用域，new Function 也复制不了那份闭包。
 *
 * Q: 和 structuredClone 差在哪？
 * A: structuredClone 碰到函数 / DOM 会抛。这版函数原样返回，DOM 当普通对象遍历。
 *
 * Q: 原型上的方法会拷过来吗？
 * A: 不会。Object.keys 只有自有可枚举键。实例的方法还在原 prototype 上。
 */

function deepClone(value, cache = new WeakMap()) {
  if (typeof value !== 'object' || value === null) return value; // 原始值直接回；null 的 typeof 是 object
  if (cache.has(value)) return cache.get(value); // 见过就回上次那份，切断循环

  if (value instanceof Date) {
    const cloned = new Date(value.getTime());
    cache.set(value, cloned);
    return cloned;
  }
  if (value instanceof RegExp) {
    const cloned = new RegExp(value.source, value.flags);
    cache.set(value, cloned);
    return cloned;
  }
  if (value instanceof Map) {
    const cloned = new Map();
    cache.set(value, cloned); // 空壳先放，Map 里可能互指
    value.forEach((v, k) => {
      cloned.set(deepClone(k, cache), deepClone(v, cache)); // key 也可以是对象，一样要拷
    });
    return cloned;
  }
  if (value instanceof Set) {
    const cloned = new Set();
    cache.set(value, cloned);
    value.forEach((v) => {
      cloned.add(deepClone(v, cache));
    });
    return cloned;
  }

  const cloned = Array.isArray(value) ? [] : {};
  cache.set(value, cloned); // 先入缓存，循环引用回来时能命中
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i++) {
    cloned[keys[i]] = deepClone(value[keys[i]], cache);
  }
  return cloned;
}

/**
 * 延伸 1：保留原型、Symbol、不可枚举属性和属性描述符
 *
 * 需求：class 实例拷贝后仍能调用原型方法；getter/setter、只读属性、Symbol key、
 *       稀疏数组和循环引用都要保留。
 *
 * 思路：
 * 1. 普通对象用 Object.create(originalPrototype) 建壳，数组仍用真正的 [] 建壳。
 * 2. getOwnPropertyDescriptors 一次拿到全部自有属性及其特征。
 * 3. 数据属性的 value 递归拷贝；访问器函数原样复用，再 defineProperties 回去。
 *
 * ——— 示例 ———
 * 输入：class User { hi() {} }；copy = deepCloneComplete(new User())
 * 输出：copy instanceof User 为 true，copy.hi 仍可调用
 */
function deepCloneComplete(value, cache = new WeakMap()) {
  if (typeof value !== 'object' || value === null) return value;
  if (cache.has(value)) return cache.get(value);

  if (value instanceof Date) {
    const cloned = new Date(value.getTime());
    cache.set(value, cloned);
    return cloned;
  }
  if (value instanceof RegExp) {
    const cloned = new RegExp(value.source, value.flags);
    cloned.lastIndex = value.lastIndex;
    cache.set(value, cloned);
    return cloned;
  }
  if (value instanceof Map) {
    const cloned = new Map();
    cache.set(value, cloned);
    value.forEach((item, key) => {
      cloned.set(deepCloneComplete(key, cache), deepCloneComplete(item, cache));
    });
    return cloned;
  }
  if (value instanceof Set) {
    const cloned = new Set();
    cache.set(value, cloned);
    value.forEach((item) => cloned.add(deepCloneComplete(item, cache)));
    return cloned;
  }
  if (value instanceof ArrayBuffer) {
    const cloned = value.slice(0);
    cache.set(value, cloned);
    return cloned;
  }
  if (ArrayBuffer.isView(value)) {
    const buffer = deepCloneComplete(value.buffer, cache);
    const cloned = value instanceof DataView
      ? new DataView(buffer, value.byteOffset, value.byteLength)
      : new value.constructor(buffer, value.byteOffset, value.length);
    cache.set(value, cloned);
    return cloned;
  }

  const cloned = Array.isArray(value)
    ? new Array(value.length)
    : Object.create(Object.getPrototypeOf(value));
  cache.set(value, cloned);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const key of Reflect.ownKeys(descriptors)) {
    if ('value' in descriptors[key]) {
      descriptors[key].value = deepCloneComplete(descriptors[key].value, cache);
    }
  }
  Object.defineProperties(cloned, descriptors);
  return cloned;
}

/**
 * 延伸 2：平台版 structuredClone
 *
 * 需求：浏览器或 Node 已提供 structuredClone 时，可直接处理循环引用、Map、Set、
 * ArrayBuffer 等结构化数据，并可用 transfer 转移大块二进制数据的所有权。
 *
 * 思路：平台函数由引擎实现，不能复制函数、WeakMap、DOM 节点等不可结构化克隆的值。
 * 包一层的价值是统一环境检查和 transfer 参数。
 *
 * ——— 示例 ———
 * 输入：cloneStructured({ buffer }, [buffer])
 * 输出：新对象持有 buffer，原 buffer 的 byteLength 变成 0
 */
function cloneStructured(value, transfer = []) {
  if (typeof structuredClone !== 'function') {
    throw new Error('当前环境不支持 structuredClone');
  }
  return structuredClone(value, { transfer });
}

// —— 自测（实现前跑会报错，实现后应逐行打印期望值）——
const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
const copy = deepClone(obj);
copy.b.c = 999;
console.log(obj.b.c);  // 2
console.log(copy.b.c); // 999

const cyclic = { name: 'self' };
cyclic.self = cyclic;
console.log(deepClone(cyclic).self.name); // 'self'

module.exports = { deepClone, deepCloneComplete, cloneStructured };
