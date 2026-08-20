/**
 * 手写 call / apply
 *
 * 需求：在 Function.prototype 上实现 myCall 和 myApply，行为对齐原生：
 *   - 指定函数运行时的 this；
 *   - myCall 参数逐个传入；myApply 参数以数组传入；
 *   - context 为 null/undefined 时，this 指向全局对象（非严格模式）；
 *   - 返回被调用函数的返回值。
 *
 * ——— 示例 ———
 * 原函数： function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
 * 输入： greet.myCall({ name: '小明' }, '你好', '!')     输出： '你好 小明!'
 * 输入： greet.myApply({ name: '小红' }, ['嗨', '~'])   输出： '嗨 小红~'
 */

Function.prototype.myCall = function () {
};

Function.prototype.myApply = function () {
};

// —— 自测 ——
function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
console.log(greet.myCall({ name: '小明' }, '你好', '!'));   // '你好 小明!'
console.log(greet.myApply({ name: '小红' }, ['嗨', '~'])); // '嗨 小红~'

module.exports = {};
