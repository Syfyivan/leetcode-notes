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
 *
 * ——— 常见追问 ———
 * Q: 为什么用 Symbol 当 key？
 * A: 绝对不撞对象已有字段，普通 for-in 也扫不到。调完立刻 delete。
 *
 * Q: 基本类型为什么要 Object() 包一层？
 * A: 数字、字符串不能挂属性。Object(1) 变成 Number 包装对象，才能当 context。
 *
 * Q: 为什么还要 delete？
 * A: 挂上去是借路。不删就污染调用方，Object.keys 还能扫到这个函数。
 *
 * Q: apply 第二参是 null / undefined 怎么办？
 * A: 原生当没传参。所以 `args || []`，展开成零个参数。
 *
 * Q: 和 bind 的区别？
 * A: call / apply 立刻跑并返回结果。bind 返回冻住 this 的新函数，不执行。
 */

Function.prototype.myCall = function (context, ...args) {
  context = context == null ? globalThis : Object(context); // == 同时吃 null / undefined
  const key = Symbol(); // 不撞名，也躲过 for-in
  context[key] = this; // 挂上去再调，this 才会指向 context
  const result = context[key](...args);
  delete context[key]; // 借路用完拿走，别污染调用方
  return result;
};

Function.prototype.myApply = function (context, args) {
  return this.myCall(context, ...(args || [])); // 没传 args 当空数组，对齐原生
};

/**
 * 延伸 1：用 Reflect.apply 避免临时改写 context
 *
 * 需求：冻结对象、不可扩展对象也能充当 this，并且调用后不需要 delete 临时属性。
 *
 * 思路：Reflect.apply 直接接收目标函数、this 和参数数组，由引擎完成调用。
 * 它还保留严格模式语义：严格函数收到 null 时，this 就是 null。
 *
 * ——— 示例 ———
 * 输入：callReflect(function () { 'use strict'; return this; }, null)
 * 输出：null
 */
function callReflect(fn, context, ...args) {
  if (typeof fn !== 'function') throw new TypeError('fn 必须是函数');
  return Reflect.apply(fn, context, args);
}

/**
 * 延伸 2：校验 apply 的类数组参数
 *
 * 需求：第二个参数可传数组或 arguments 这类可迭代/类数组对象；传数字等非法值时抛错。
 *
 * 思路：null / undefined 当空参数；其余值先要求是对象，再用 Array.from 转成真正数组。
 *
 * ——— 示例 ———
 * 输入：applyReflect(Math.max, null, { 0: 3, 1: 7, length: 2 })
 * 输出：7
 */
function applyReflect(fn, context, args) {
  if (args == null) return callReflect(fn, context);
  if ((typeof args !== 'object' && typeof args !== 'function')) {
    throw new TypeError('apply 的参数列表必须是对象');
  }
  return callReflect(fn, context, ...Array.from(args));
}

// —— 自测 ——
function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
console.log(greet.myCall({ name: '小明' }, '你好', '!'));   // '你好 小明!'
console.log(greet.myApply({ name: '小红' }, ['嗨', '~'])); // '嗨 小红~'

module.exports = { callReflect, applyReflect };
