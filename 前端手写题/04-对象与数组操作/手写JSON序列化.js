/**
 * 手写 JSON.stringify / parse（简化版）
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：
 *   - jsonStringify(value)：把 null / 数字 / 布尔 / 字符串 / 数组 / 纯对象
 *     序列化成 JSON 字符串；undefined、函数作为对象值时该键被忽略。
 *   - jsonParse(str)：把上面的字符串还原成值（简化版可借助递归下降解析，
 *     面试里说清思路即可，不必处理所有转义边界）。
 *
 * 思路：
 * 1. stringify 按类型分支：null、数字、布尔直接转字符串，字符串两边加引号。
 * 2. 数组逐项拼，对象按 key 拼。值是 undefined 或函数时，对象丢掉这个键，数组写成 null。
 * 3. parse 看当前字符决定走对象、数组、字符串、数字还是 true/false/null，再递归往下读。
 * 4. 边界 / 易错：对象里的 undefined 是省略键，不要写成 "undefined"。
 *
 * ——— 示例 ———
 * 输入： jsonStringify({ a: 1, b: [true, null], c: 'hi' })
 * 输出： '{"a":1,"b":[true,null],"c":"hi"}'
 *
 * 输入： jsonParse('{"a":1,"b":[true,null]}')
 * 输出： { a: 1, b: [true, null] }
 *
 * ——— 常见追问 ———
 * Q: 对象里的 undefined 和数组里的为什么处理不一样？
 * A: 规范如此。对象省略这个键，数组写成 null，长度不能塌。
 *
 * Q: NaN、Infinity 为什么是 null？
 * A: JSON 没有这两种数字。Number.isFinite 挡住，按规范写成 null。
 *
 * Q: parse 为什么共用一个 i？
 * A: 递归下降，i 是读指针。对象、数组、字符串都从当前位置接着往下吃。
 *
 * Q: 字符串转义为什么先处理反斜杠再处理引号？
 * A: 先把 \ 变成 \\，再把 " 变成 \"。反过来的话，给引号新加的 \ 会被再转一次。
 *
 * Q: 循环引用怎么处理？
 * A: 带个栈 / WeakSet，见过就抛 TypeError。JSON.stringify 本身就是这么干的。
 */

function jsonStringify(value) {
  if (value === null) return 'null'; // typeof null 是 object，必须先挡
  const t = typeof value;
  if (t === 'number') return Number.isFinite(value) ? String(value) : 'null'; // NaN / Infinity 按规范写成 null
  if (t === 'boolean') return String(value);
  if (t === 'string') {
    // 先转 \ 再转 "，顺序反了新加的 \ 会被二次转义
    return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  if (t === 'undefined' || t === 'function') return undefined; // 顶层拿到 undefined；对象那边据此丢键
  if (Array.isArray(value)) {
    const items = value.map((item) => {
      const s = jsonStringify(item);
      return s === undefined ? 'null' : s; // 数组里占位成 null，长度不能塌
    });
    return '[' + items.join(',') + ']';
  }
  if (t === 'object') {
    const parts = [];
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) {
      const s = jsonStringify(value[keys[i]]);
      if (s === undefined) continue; // 对象里的 undefined / 函数直接丢键
      parts.push(jsonStringify(keys[i]) + ':' + s);
    }
    return '{' + parts.join(',') + '}';
  }
}

function jsonParse(str) {
  let i = 0; // 读指针，对象 / 数组 / 字符串的解析器共用

  function skipSpace() {
    while (str[i] === ' ' || str[i] === '\n' || str[i] === '\t' || str[i] === '\r') i++;
  }

  function parseValue() {
    skipSpace();
    const c = str[i];
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    if (c === '"') return parseString();
    if (c === 't') { i += 4; return true; }  // 假定输入合法，true/false/null 定长跳过
    if (c === 'f') { i += 5; return false; }
    if (c === 'n') { i += 4; return null; }
    return parseNumber();
  }

  function parseString() {
    i++;
    let s = '';
    while (i < str.length && str[i] !== '"') {
      if (str[i] === '\\') {
        i++;
        const esc = str[i++];
        const map = { n: '\n', t: '\t', r: '\r', '"': '"', '\\': '\\' };
        s += map[esc] != null ? map[esc] : esc; // 不认识的转义原样留下
      } else {
        s += str[i++];
      }
    }
    i++;
    return s;
  }

  function parseNumber() {
    const start = i;
    if (str[i] === '-') i++;
    while (str[i] >= '0' && str[i] <= '9') i++;
    if (str[i] === '.') {
      i++;
      while (str[i] >= '0' && str[i] <= '9') i++;
    }
    return Number(str.slice(start, i)); // 指针已走过这段，切片转 Number
  }

  function parseArray() {
    i++;
    const arr = [];
    skipSpace();
    if (str[i] === ']') { i++; return arr; }
    while (true) {
      arr.push(parseValue());
      skipSpace();
      if (str[i] === ',') { i++; continue; }
      i++; // 吃掉 ]
      break;
    }
    return arr;
  }

  function parseObject() {
    i++;
    const obj = {};
    skipSpace();
    if (str[i] === '}') { i++; return obj; }
    while (true) {
      skipSpace();
      const key = parseString();
      skipSpace();
      i++; // 吃掉 :
      // defineProperty 可把 "__proto__" 当普通数据键，避免触发原型 setter。
      Object.defineProperty(obj, key, {
        value: parseValue(),
        enumerable: true,
        writable: true,
        configurable: true,
      });
      skipSpace();
      if (str[i] === ',') { i++; continue; }
      i++;
      break;
    }
    return obj;
  }

  return parseValue();
}

/**
 * 延伸 1：replacer / space / toJSON / 循环引用
 *
 * 需求：补齐 JSON.stringify 的高频进阶规则：
 *   - 对象有 toJSON 时先调用；
 *   - replacer 函数可替换值，replacer 数组可筛选对象 key；
 *   - space 控制缩进，最多取 10 个空格或 10 个字符；
 *   - 循环引用和 BigInt 抛 TypeError；字符串补齐控制字符转义。
 *
 * 思路：
 * 1. 用 holder + key 调度每个值，才能给 replacer 正确的 this 和 key。
 * 2. Set 只记录当前递归路径。兄弟字段共享同一对象不是循环，离开该对象时要 delete。
 * 3. indent 记录当前缩进，数组和对象按 gap 决定紧凑或换行格式。
 *
 * ——— 示例 ———
 * 输入：jsonStringifyComplete({a:1,b:2}, ['a'], 2)
 * 输出：只保留 a，并使用两个空格格式化
 */
function jsonStringifyComplete(value, replacer, space) {
  const replacerFn = typeof replacer === 'function' ? replacer : null;
  const propertyList = Array.isArray(replacer)
    ? [...new Set(replacer
      .filter((item) => typeof item === 'string' || typeof item === 'number')
      .map(String))]
    : null;
  const gap = typeof space === 'number'
    ? ' '.repeat(Math.min(10, Math.max(0, Math.floor(space))))
    : typeof space === 'string' ? space.slice(0, 10) : '';
  const stack = new Set();

  function quote(text) {
    const escapes = {
      '"': '\\"',
      '\\': '\\\\',
      '\b': '\\b',
      '\f': '\\f',
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
    };
    return '"' + String(text).replace(/[\\"\u0000-\u001f]/g, (char) =>
      escapes[char] || `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
    ) + '"';
  }

  function serialize(key, holder, indent) {
    let current = holder[key];
    if (current && typeof current === 'object' && typeof current.toJSON === 'function') {
      current = current.toJSON(key);
    }
    if (replacerFn) current = replacerFn.call(holder, key, current);

    if (current === null) return 'null';
    if (typeof current === 'string') return quote(current);
    if (typeof current === 'number') return Number.isFinite(current) ? String(current) : 'null';
    if (typeof current === 'boolean') return String(current);
    if (typeof current === 'bigint') throw new TypeError('BigInt 不能序列化为 JSON');
    if (typeof current !== 'object') return undefined;
    if (stack.has(current)) throw new TypeError('Converting circular structure to JSON');

    stack.add(current);
    const nextIndent = indent + gap;
    let output;
    if (Array.isArray(current)) {
      const parts = [];
      for (let i = 0; i < current.length; i++) {
        parts.push(serialize(String(i), current, nextIndent) ?? 'null');
      }
      output = gap && parts.length
        ? `[\n${nextIndent}${parts.join(`,\n${nextIndent}`)}\n${indent}]`
        : `[${parts.join(',')}]`;
    } else {
      const keys = propertyList || Object.keys(current);
      const parts = [];
      for (const itemKey of keys) {
        if (!Object.prototype.hasOwnProperty.call(current, itemKey)) continue;
        const item = serialize(itemKey, current, nextIndent);
        if (item !== undefined) parts.push(`${quote(itemKey)}${gap ? ': ' : ':'}${item}`);
      }
      output = gap && parts.length
        ? `{\n${nextIndent}${parts.join(`,\n${nextIndent}`)}\n${indent}}`
        : `{${parts.join(',')}}`;
    }
    stack.delete(current);
    return output;
  }

  return serialize('', { '': value }, '');
}

/**
 * 延伸 2：parse reviver
 *
 * 需求：解析完成后从叶子向根调用 reviver(key, value)。返回 undefined 就删除该属性，
 * 返回其他值就用它替换。可用来把 ISO 字符串还原成 Date。
 *
 * 思路：先完成语法解析，再做一次后序遍历；先处理孩子，最后处理父节点。
 *
 * ——— 示例 ———
 * 输入：jsonParseWithReviver('{"n":1}', (key, value) => key === 'n' ? value + 1 : value)
 * 输出：{ n: 2 }
 */
function jsonParseWithReviver(text, reviver) {
  const parsed = jsonParse(text);
  if (typeof reviver !== 'function') return parsed;
  const root = { '': parsed };

  function walk(holder, key) {
    let value = holder[key];
    if (value !== null && typeof value === 'object') {
      for (const childKey of Object.keys(value)) {
        const next = walk(value, childKey);
        if (next === undefined) delete value[childKey];
        else value[childKey] = next;
      }
    }
    return reviver.call(holder, key, value);
  }

  return walk(root, '');
}

// —— 自测 ——
console.log(jsonStringify({ a: 1, b: [true, null], c: 'hi' }));
// {"a":1,"b":[true,null],"c":"hi"}
console.log(jsonParse('{"a":1,"b":[true,null]}'));
// { a: 1, b: [ true, null ] }

module.exports = {
  jsonStringify,
  jsonParse,
  jsonStringifyComplete,
  jsonParseWithReviver,
};
