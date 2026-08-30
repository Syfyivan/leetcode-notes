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
 */

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target, source) {
  const result = { ...target };
  const keys = Object.keys(source);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const sv = source[key];
    const tv = result[key];
    if (isPlainObject(tv) && isPlainObject(sv)) {
      result[key] = deepMerge(tv, sv);
    } else {
      result[key] = sv;
    }
  }
  return result;
}

// —— 自测 ——
console.log(deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 }));
// { a: 1, b: { x: 1, y: 2 }, c: 3 }

module.exports = { deepMerge };
