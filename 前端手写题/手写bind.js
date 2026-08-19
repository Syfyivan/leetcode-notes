/**
 * 手写 bind
 *
 * 需求：在 Function.prototype 上实现 myBind，行为对齐原生 bind：
 *   - 绑定 this；
 *   - 支持预置参数 + 调用时追加参数（柯里化）；
 *   - 作为构造函数（new）调用时，this 应指向新实例而非绑定对象。
 *
 * ——— 示例 ———
 * 原函数： function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
 * 输入： const bound = greet.myBind({ name: '小明' }, '你好');
 *        bound('!')
 * 输出： '你好 小明!'
 */

Function.prototype.myBind = function () {
  // TODO
};

// —— 自测 ——
function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
const bound = greet.myBind({ name: '小明' }, '你好');
console.log(bound('!')); // '你好 小明!'

module.exports = {};
