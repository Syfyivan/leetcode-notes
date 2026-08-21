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
 * ——— 示例 ———
 * 输入： jsonStringify({ a: 1, b: [true, null], c: 'hi' })
 * 输出： '{"a":1,"b":[true,null],"c":"hi"}'
 *
 * 输入： jsonParse('{"a":1,"b":[true,null]}')
 * 输出： { a: 1, b: [true, null] }
 */

function jsonStringify() {
}

function jsonParse() {
}

// —— 自测 ——
console.log(jsonStringify({ a: 1, b: [true, null], c: 'hi' }));
// {"a":1,"b":[true,null],"c":"hi"}
console.log(jsonParse('{"a":1,"b":[true,null]}'));
// { a: 1, b: [ true, null ] }

module.exports = { jsonStringify, jsonParse };
