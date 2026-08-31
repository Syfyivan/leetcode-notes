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
 * 思路：
 * 1. 遍历 source 的键。两边同名且都是纯对象，就递归合。
 * 2. 其余情况用 source 覆盖。数组、原始值都整段覆盖，不按元素合。
 * 3. 边界 / 易错：先浅拷一层 target，别直接改传入对象；判断纯对象时把数组排除掉。
 *
 * ——— 示例 ———
 * 输入： deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 })
 * 输出： { a: 1, b: { x: 1, y: 2 }, c: 3 }
 *
 * ——— 常见追问 ———
 * Q: 为什么数组不递归合？
 * A: 配置里数组多半是整份替换，[1,2] 合 [3] 很少有人想要 [3,2]。
 *    当对象合还会留下数字键和空洞。
 *
 * Q: 为什么先 { ...target }？
 * A: 浅拷一层，外面不改传入对象。没被合到的嵌套还是原引用，真要隔离再深拷。
 *
 * Q: Date / RegExp 怎么处理？
 * A: 这版 isPlainObject 只排除了数组，Date 会被当对象遍历，可枚举字段是空的，
 *    合完变成 {}。追问时说：非 plain 当叶子，source 整份盖上去。
 *
 * Q: 会改 source 吗？
 * A: 不会写 source。但 result 可能直接挂上 source 的子对象，之后改 result 可能伤到它。
 */

function isPlainObject(value) {
  if (value === null || Object.prototype.toString.call(value) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * 延伸 1：合并多个 source
 *
 * 需求：从左到右合并任意多个配置，后面的值覆盖前面的值。
 *
 * 思路：以 target 为累加器，对 sources 依次调用 deepMerge。
 *
 * ——— 示例 ———
 * 输入：mergeAll({a:1}, {b:2}, {a:3})
 * 输出：{a:3,b:2}
 */
function mergeAll(target, ...sources) {
  return sources.reduce((result, source) => deepMerge(result, source), target);
}

/**
 * 延伸 2：mergeWith 自定义合并策略
 *
 * 需求：customizer(targetValue, sourceValue, key, path) 可接管某个字段；
 * 返回 undefined 时使用默认规则。默认数组仍整段覆盖。
 *
 * 思路：
 * 1. 每个 key 先询问 customizer。
 * 2. 有明确返回值就采用；否则两个纯对象继续递归。
 * 3. 拦截危险 key，避免配置对象触发原型污染。
 *
 * ——— 示例 ———
 * 输入：mergeWith({tags:['a']}, {tags:['b']}, (a,b) => 数组时 a.concat(b))
 * 输出：{tags:['a','b']}
 */
function mergeWith(target, source, customizer, path = []) {
  const result = isPlainObject(target) ? { ...target } : {};
  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'prototype' || key === 'constructor') continue;
    const nextPath = path.concat(key);
    const custom = customizer(result[key], source[key], key, nextPath);
    if (custom !== undefined) {
      result[key] = custom;
    } else if (isPlainObject(result[key]) && isPlainObject(source[key])) {
      result[key] = mergeWith(result[key], source[key], customizer, nextPath);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function deepMerge(target, source) {
  const result = { ...target }; // 浅拷一层，别改调用方传进来的 target
  const keys = Object.keys(source);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === '__proto__' || key === 'prototype' || key === 'constructor') continue;
    const sv = source[key];
    const tv = result[key];
    if (isPlainObject(tv) && isPlainObject(sv)) {
      result[key] = deepMerge(tv, sv);
    } else {
      result[key] = sv; // 数组 / 原始值整段覆盖
    }
  }
  return result;
}

// —— 自测 ——
console.log(deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 }));
// { a: 1, b: { x: 1, y: 2 }, c: 3 }

module.exports = { deepMerge, mergeAll, mergeWith, isPlainObject };
