/**
 * 手写 bind
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 需求：在 Function.prototype 上实现 myBind，行为对齐原生 bind：
 *   - 绑定 this；
 *   - 支持预置参数 + 调用时追加参数（柯里化）；
 *   - 作为构造函数（new）调用时，this 应指向新实例而非绑定对象。
 *
 * 思路：
 * 1. 闭包记住原函数、绑定对象、预置参数。调用时再拼上新参数。
 * 2. 普通调用 apply 到绑定对象。
 * 3. 被 new 时 this 已经是新实例，不能再用绑定对象。instanceof 判断。
 *
 * ——— 示例 ———
 * 原函数： function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
 * 输入： const bound = greet.myBind({ name: '小明' }, '你好');
 *        bound('!')
 * 输出： '你好 小明!'
 */

Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  const bound = function (...args) {
    // new bound() 时 this 已经是新实例，丢掉绑定对象
    const ctx = this instanceof bound ? this : context;
    return fn.apply(ctx, boundArgs.concat(args));
  };
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
  }
  return bound;
};

// —— 自测 ——
function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
const bound = greet.myBind({ name: '小明' }, '你好');
console.log(bound('!')); // '你好 小明!'

module.exports = {};
