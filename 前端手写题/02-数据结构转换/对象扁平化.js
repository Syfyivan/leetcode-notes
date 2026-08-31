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
 *
 * ——— 常见追问 ———
 * Q: 为什么要先判断 Array.isArray，再判断 typeof === 'object'？
 * A: 数组也是 object。先走对象分支会拼成 b.0，题目要的是 b[0]。
 *
 * Q: 0 / false / '' 丢不丢？
 * A: 留。只有 null、undefined 丢。typeof null 是 object，必须先挡掉，
 *    否则会进去遍历，直接报错或写出一堆脏 key。
 *
 * Q: 迭代版为什么倒序入栈？
 * A: 栈后进先出。想先处理 a 再处理 b，入栈时就要先推 b 再推 a。
 *    正序入栈值也对，key 的插入顺序会反，题目一般不卡顺序。
 *
 * Q: Date、Map 这类对象怎么处理？
 * A: 基础题当普通对象递归，Date 没有可枚举字段，结果是空。
 *    追问时可以说：非 plain object 当叶子，JSON.stringify 同款策略。
 */

function flattenObject(obj, prefix = '', res = {}) {
  for (const key in obj) {
    const path = prefix ? prefix + '.' + key : key;
    // null 必须单独挡：typeof null === 'object'
    if (typeof obj[key] === 'object' && obj[key] !== null) {
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

/**
 * 延伸 1：数组使用 [i] 路径
 *
 * 需求：对象字段用点连接，数组下标用方括号；null / undefined 不写入结果。
 *
 * 思路：
 * 1. 数组先于普通对象判断，路径直接追加 [index]。
 * 2. 对象追加 `.key`，顶层没有前缀点。
 * 3. 走到基本类型才写结果；递归版和栈版产出相同。
 *
 * ——— 示例 ———
 * 输入：{ a: 1, b: [1, { c: true }, [3]], g: null }
 * 输出：{ a: 1, 'b[0]': 1, 'b[1].c': true, 'b[2][0]': 3 }
 */
function flatten(input) {
  const result = {};

  function walk(value, path) {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        walk(item, `${path}[${index}]`); // 数组只拼 [i]，前面不加 .
      });
      return;
    }

    if (typeof value === 'object') {
      for (const key of Object.keys(value)) {
        const next = path ? `${path}.${key}` : key; // 顶层没有前缀，不用点
        walk(value[key], next);
      }
      return;
    }

    if (path) result[path] = value; // 走到叶子才写入
  }

  walk(input, '');
  return result;
}

function flattenIter(input) {
  const result = {};
  const stack = [{ value: input, path: '' }];

  while (stack.length) {
    const { value, path } = stack.pop();
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      // 倒序入栈，弹出来才是 0、1、2 的正序
      for (let i = value.length - 1; i >= 0; i--) {
        stack.push({ value: value[i], path: `${path}[${i}]` });
      }
      continue;
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        stack.push({
          value: value[key],
          path: path ? `${path}.${key}` : key,
        });
      }
      continue;
    }

    if (path) result[path] = value;
  }

  return result;
}

/**
 * 延伸 2：还原点路径和数组路径
 *
 * 需求：把 `a.b[0].c` 拆成字段序列，并根据下一段是不是数字决定创建对象还是数组。
 * 同时拦住 __proto__ / constructor / prototype，避免不可信路径污染对象原型。
 *
 * 思路：
 * 1. 正则同时提取点路径字段和方括号下标。
 * 2. 下一段全是数字时建 []，否则建无原型对象。
 * 3. 最后一段直接赋值；危险字段提前报错。
 *
 * ——— 示例 ———
 * 输入：{ 'users[0].name': '小明', 'users[1].name': '小红' }
 * 输出：{ users: [{ name: '小明' }, { name: '小红' }] }
 */
function unflatten(input) {
  const result = Object.create(null);
  const blocked = new Set(['__proto__', 'prototype', 'constructor']);

  for (const [path, value] of Object.entries(input)) {
    const parts = path.match(/[^.[\]]+/g) || [];
    if (parts.length === 0) continue;
    if (parts.some((part) => blocked.has(part))) {
      throw new Error(`不安全的路径: ${path}`);
    }

    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      if (i === parts.length - 1) {
        current[key] = value;
        break;
      }
      const nextIsIndex = /^\d+$/.test(parts[i + 1]);
      if (current[key] == null) {
        current[key] = nextIsIndex ? [] : Object.create(null);
      }
      current = current[key];
    }
  }
  return result;
}

// —— 自测 ——
console.log(flattenObject({ a: { b: 1, c: { d: 2 } } }));   // { 'a.b': 1, 'a.c.d': 2 }
console.log(unflattenObject({ 'a.b': 1, 'a.c.d': 2 }));     // { a: { b: 1, c: { d: 2 } } }

const nested = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
};
console.log(flatten(nested));
console.log(flattenIter(nested));
// { a: 1, 'b[0]': 1, 'b[1]': 2, 'b[2].c': true, 'b[3][0]': 3, 'd.e': 2, 'd.f': 3 }

module.exports = {
  flattenObject,
  unflattenObject,
  flatten,
  flattenIter,
  unflatten,
};
