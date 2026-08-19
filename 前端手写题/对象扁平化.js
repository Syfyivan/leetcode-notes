/**
 * 对象扁平化 / 反扁平化
 *
 * flattenObject：把嵌套对象压平成"点路径 -> 值"的单层对象。
 * unflattenObject：把点路径对象还原回嵌套结构（前者的逆操作）。
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

function unflattenObject() {
  // TODO
}

// —— 自测 ——
console.log(flattenObject({ a: { b: 1, c: { d: 2 } } }));   // { 'a.b': 1, 'a.c.d': 2 }
console.log(unflattenObject({ 'a.b': 1, 'a.c.d': 2 }));     // { a: { b: 1, c: { d: 2 } } }

module.exports = { flattenObject, unflattenObject };
