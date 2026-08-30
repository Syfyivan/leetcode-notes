/**
 * 对象扁平化 / 反扁平化
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * flattenObject：把嵌套对象压平成"点路径 -> 值"的单层对象。
 * unflattenObject：把点路径对象还原回嵌套结构（前者的逆操作）。
 *
 * 思路：
 * 1. flatten 碰到对象就继续往下走，路径用点拼。
 * 2. 叶子（非对象或 null）写进结果。typeof null 是 object，要单独挡掉。
 * 3. unflatten 按点切开，一层层建空对象，最后给叶子赋值。
 *
 * ——— 示例 ———
 * flatten 输入： { a: { b: 1, c: { d: 2 } } }
 * flatten 输出： { 'a.b': 1, 'a.c.d': 2 }
 *
 * unflatten 输入： { 'a.b': 1, 'a.c.d': 2 }
 * unflatten 输出： { a: { b: 1, c: { d: 2 } } }
 */

function flattenObject(obj, prefix = '', res = {}) {
  for(const key in obj) {
    const path = prefix ? prefix + '.' + key : key;
    if(typeof obj[key] === 'object' && obj[key] !== null) {
      flattenObject(obj[key], path, res);
    } else {
      res[path] = obj[key];
    }
  }
  return res;
}

function unflattenObject(obj) {
  const res = {};
  for (const path in obj) {
    const keys = path.split('.');
    let cur = res;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
    cur[keys[keys.length - 1]] = obj[path];
  }
  return res;
}

// —— 自测 ——
console.log(flattenObject({ a: { b: 1, c: { d: 2 } } }));   // { 'a.b': 1, 'a.c.d': 2 }
console.log(unflattenObject({ 'a.b': 1, 'a.c.d': 2 }));     // { a: { b: 1, c: { d: 2 } } }

module.exports = { flattenObject, unflattenObject };
