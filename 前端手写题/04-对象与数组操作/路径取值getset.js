/**
 * 安全取值 / 赋值 get / set（路径访问）
 *
 * 优先级：前端 P1 · 全栈 P2
 *
 * 需求：实现 lodash 风格的路径访问：
 *   - get(obj, path, defaultValue)：按路径取值，中途遇到 undefined
 *     就返回 defaultValue。path 支持 'a.b[0].c' 和 ['a','b',0,'c'] 两种写法；
 *   - set(obj, path, value)：按路径写值，中间缺失的层级自动补齐。
 *
 * 思路：
 * 1. 路径先统一拆成 token：'a.b[0].c' 把 [0] 换成 .0，再按点切开。
 * 2. get 顺着走，中途碰到 null / undefined 就返回 defaultValue。
 * 3. set 往下走时缺层级就补。下一个 token 是数字就补数组，否则补对象。
 * 4. 边界 / 易错：set 要看下一个键是不是下标，才能决定补 [] 还是 {}。
 *
 * ——— 示例 ———
 * const obj = { a: { b: [{ c: 42 }] } };
 * 输入： get(obj, 'a.b[0].c')
 * 输出： 42
 *
 * 输入： get(obj, 'a.x.y', 'default')
 * 输出： 'default'
 *
 * 输入： set({}, 'a.b[0]', 1)
 * 输出： { a: { b: [1] } }
 */

function toPath(path) {
  if (Array.isArray(path)) return path;
  return String(path)
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter((seg) => seg !== '');
}

function get(obj, path, defaultValue) {
  const keys = toPath(path);
  let cur = obj;
  for (let i = 0; i < keys.length; i++) {
    if (cur == null) return defaultValue;
    cur = cur[keys[i]];
  }
  return cur === undefined ? defaultValue : cur;
}

function set(obj, path, value) {
  const keys = toPath(path);
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (cur[key] == null) {
      // 下一截是下标就补数组，否则补对象
      cur[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    cur = cur[key];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

// —— 自测 ——
const obj = { a: { b: [{ c: 42 }] } };
console.log(get(obj, 'a.b[0].c'));       // 42
console.log(get(obj, 'a.x.y', 'default')); // default
console.log(set({}, 'a.b[0]', 1));       // { a: { b: [1] } }

module.exports = { get, set };
