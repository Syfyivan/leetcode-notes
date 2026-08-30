/**
 * 手写 call / apply
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 需求：在 Function.prototype 上实现 myCall 和 myApply，行为对齐原生：
 *   - 指定函数运行时的 this；
 *   - myCall 参数逐个传入；myApply 参数以数组传入；
 *   - context 为 null/undefined 时，this 指向全局对象（非严格模式）；
 *   - 返回被调用函数的返回值。
 *
 * 思路：
 * 1. 把函数挂到 context 上再调，this 就指向它。
 * 2. Symbol 当 key，避免覆盖已有属性。调完删掉。
 * 3. null/undefined 用 globalThis。基本类型先 Object() 包一下才能挂属性。
 *
 * ——— 示例 ———
 * 原函数： function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
 * 输入： greet.myCall({ name: '小明' }, '你好', '!')     输出： '你好 小明!'
 * 输入： greet.myApply({ name: '小红' }, ['嗨', '~'])   输出： '嗨 小红~'
 */

Function.prototype.myCall = function (context, ...args) {
  context = context == null ? globalThis : Object(context);
  const key = Symbol();
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
};

Function.prototype.myApply = function (context, args) {
  return this.myCall(context, ...(args || []));
};

// —— 自测 ——
function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
console.log(greet.myCall({ name: '小明' }, '你好', '!'));   // '你好 小明!'
console.log(greet.myApply({ name: '小红' }, ['嗨', '~'])); // '嗨 小红~'

module.exports = {};
