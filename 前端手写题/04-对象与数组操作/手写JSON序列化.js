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
 */

function jsonStringify(value) {
  if (value === null) return 'null';
  const t = typeof value;
  if (t === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (t === 'boolean') return String(value);
  if (t === 'string') {
    return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  if (t === 'undefined' || t === 'function') return undefined;
  if (Array.isArray(value)) {
    const items = value.map((item) => {
      const s = jsonStringify(item);
      return s === undefined ? 'null' : s;
    });
    return '[' + items.join(',') + ']';
  }
  if (t === 'object') {
    const parts = [];
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) {
      const s = jsonStringify(value[keys[i]]);
      if (s === undefined) continue;
      parts.push(jsonStringify(keys[i]) + ':' + s);
    }
    return '{' + parts.join(',') + '}';
  }
}

function jsonParse(str) {
  let i = 0;

  function skipSpace() {
    while (str[i] === ' ' || str[i] === '\n' || str[i] === '\t' || str[i] === '\r') i++;
  }

  function parseValue() {
    skipSpace();
    const c = str[i];
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    if (c === '"') return parseString();
    if (c === 't') { i += 4; return true; }
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
        s += map[esc] != null ? map[esc] : esc;
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
    return Number(str.slice(start, i));
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
      i++;
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
      i++;
      obj[key] = parseValue();
      skipSpace();
      if (str[i] === ',') { i++; continue; }
      i++;
      break;
    }
    return obj;
  }

  return parseValue();
}

// —— 自测 ——
console.log(jsonStringify({ a: 1, b: [true, null], c: 'hi' }));
// {"a":1,"b":[true,null],"c":"hi"}
console.log(jsonParse('{"a":1,"b":[true,null]}'));
// { a: 1, b: [ true, null ] }

module.exports = { jsonStringify, jsonParse };
