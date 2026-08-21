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

function get() {
}

function set() {
}

// —— 自测 ——
const obj = { a: { b: [{ c: 42 }] } };
console.log(get(obj, 'a.b[0].c'));       // 42
console.log(get(obj, 'a.x.y', 'default')); // default
console.log(set({}, 'a.b[0]', 1));       // { a: { b: [1] } }

module.exports = { get, set };
