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
 *
 * ——— 常见追问 ———
 * Q: 为什么 [0] 要先替换成 .0？
 * A: 统一按点切开。'a.b[0].c' → 'a.b.0.c' → ['a','b','0','c']。后面都用 [] 取。
 *
 * Q: get 里为什么用 == null？
 * A: 同时挡住 null 和 undefined。中途断了就别往下读，否则 null.x 会抛。
 *
 * Q: 路径在但值就是 undefined，能拿到 default 吗？
 * A: 能。最后 cur === undefined 也会回 default。想区分「没有键」和「值是 undefined」，得另做 has。
 *
 * Q: set 怎么决定补 [] 还是 {}？
 * A: 看下一个 token 是不是纯数字。'a.b[0]' 的 b 后面是 0，所以 b 补数组。
 *
 * Q: get 到 null 返回 null 还是 default？
 * A: 终点值是 null 就回 null，null 是合法值。只有 undefined 才走 default。
 *    中途的 null 才会提前 default。
 */

function toPath(path) {
  if (Array.isArray(path)) return path;
  return String(path)
    .replace(/\[(\d+)\]/g, '.$1') // [0] 收成 .0，后面就能统一 split('.')
    .split('.')
    .filter((seg) => seg !== ''); // 去掉开头空段，'.a.b' 也能用
}

function get(obj, path, defaultValue) {
  const keys = toPath(path);
  let cur = obj;
  for (let i = 0; i < keys.length; i++) {
    if (cur == null) return defaultValue; // 中途 null / undefined 都停，避免读 null.x 抛错
    cur = cur[keys[i]];
  }
  return cur === undefined ? defaultValue : cur; // null 是合法值，只有 undefined 才兜底
}

function set(obj, path, value) {
  const keys = toPath(path);
  assertSafePath(keys);
  if (keys.length === 0) throw new Error('set 路径不能为空');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (cur[key] == null) {
      // 看下一截是不是下标，决定补 [] 还是 {}
      cur[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    cur = cur[key];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

function assertSafePath(keys) {
  const blocked = new Set(['__proto__', 'prototype', 'constructor']);
  if (keys.some((key) => blocked.has(String(key)))) {
    throw new Error('路径包含可能污染原型的字段');
  }
}

/**
 * 延伸 1：has / unset
 *
 * 需求：
 *   - has 判断整条路径是否真实存在，即使终点值是 undefined 也返回 true；
 *   - unset 删除终点自有属性，成功删除返回 true，路径不存在返回 false。
 *
 * 思路：
 * 1. has 每层用 hasOwnProperty，不能拿 `value !== undefined` 代替存在性判断。
 * 2. unset 只走到倒数第二层，再 delete 最后一个 key。
 * 3. 写操作统一拦截 __proto__ 等危险字段，避免原型污染。
 *
 * ——— 示例 ———
 * 输入：has({ a: { b: undefined } }, 'a.b')
 * 输出：true
 */
function has(obj, path) {
  const keys = toPath(path);
  let current = obj;
  for (const key of keys) {
    if (current == null || !Object.prototype.hasOwnProperty.call(Object(current), key)) {
      return false;
    }
    current = current[key];
  }
  return true;
}

function unset(obj, path) {
  const keys = toPath(path);
  assertSafePath(keys);
  if (keys.length === 0) return false;
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current == null || !Object.prototype.hasOwnProperty.call(Object(current), keys[i])) {
      return false;
    }
    current = current[keys[i]];
  }
  if (current == null || !Object.prototype.hasOwnProperty.call(Object(current), keys.at(-1))) {
    return false;
  }
  return delete current[keys.at(-1)];
}

/**
 * 延伸 2：不可变 set
 *
 * 需求：写入深层字段时返回新根对象，原对象保持不变；未经过的分支继续共享旧引用。
 * 典型场景：Redux / React 状态更新，靠引用变化快速判断哪条分支改了。
 *
 * 思路：
 * 1. 根节点先浅拷，沿路径每层也只浅拷当前分支。
 * 2. 缺失层级根据下一个 token 创建数组或对象。
 * 3. 路径以外的属性不复制深层内容，保留结构共享。
 *
 * ——— 示例 ———
 * 输入：setImmutable({ a: { b: 1 }, keep: {} }, 'a.b', 2)
 * 输出：新对象的 a.b 为 2；原对象仍为 1；keep 引用保持不变
 */
function setImmutable(obj, path, value) {
  const keys = toPath(path);
  assertSafePath(keys);
  if (keys.length === 0) return value;
  const cloneContainer = (source, nextKey) => {
    if (Array.isArray(source)) return source.slice();
    if (source !== null && typeof source === 'object') return { ...source };
    return /^\d+$/.test(String(nextKey)) ? [] : {};
  };

  const root = cloneContainer(obj, keys[0]);
  let sourceCursor = obj;
  let targetCursor = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const sourceChild = sourceCursor == null ? undefined : sourceCursor[key];
    targetCursor[key] = cloneContainer(sourceChild, keys[i + 1]);
    sourceCursor = sourceChild;
    targetCursor = targetCursor[key];
  }
  targetCursor[keys.at(-1)] = value;
  return root;
}

// —— 自测 ——
const obj = { a: { b: [{ c: 42 }] } };
console.log(get(obj, 'a.b[0].c'));       // 42
console.log(get(obj, 'a.x.y', 'default')); // default
console.log(set({}, 'a.b[0]', 1));       // { a: { b: [1] } }

module.exports = { get, set, has, unset, setImmutable, toPath };
