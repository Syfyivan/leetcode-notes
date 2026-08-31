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
 *
 * ——— 常见追问 ———
 * Q: 为什么 new 的时候要丢掉绑定的 this？
 * A: 规范规定 bind 后当构造函数，this 是新实例。绑定对象只对普通调用生效。
 *
 * Q: 为什么 bound.prototype = Object.create(fn.prototype)？
 * A: new 出来的实例要挂在原函数原型上，instanceof 才为 true。create 隔一层，
 *    改 bound.prototype 不会脏到原函数。
 *
 * Q: 为什么用 concat 拼参数？
 * A: bind 时预置的在前，调用时追加的在后。这就是部分应用。
 *
 * Q: 能 bind 箭头函数吗？
 * A: 语法上能调，箭头没有自己的 this，绑了也没用。手写同样绑不上。
 *
 * Q: 和 call / apply 差在哪？
 * A: call / apply 立刻执行。bind 返回新函数，this 和前置参数先冻住，以后再调。
 */

Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this; // 后面 this 会被重绑，先把原函数抓住
  const bound = function (...args) {
    // new bound() 时 this 已经是新实例，丢掉绑定对象
    const ctx = this instanceof bound ? this : context;
    return fn.apply(ctx, boundArgs.concat(args)); // 预置在前，后传在后
  };
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype); // 直接赋值会共享，改一个脏另一个
  }
  return bound;
};

/**
 * 延伸 1：用 Reflect.construct 支持 class 构造
 *
 * 需求：基础版靠 fn.apply 执行构造函数，遇到 class 会报错；完整版本要同时支持普通调用和 new。
 *
 * 思路：
 * 1. new.target 有值，说明 bound 正在被构造调用。
 * 2. 构造分支交给 Reflect.construct，class、显式返回对象、new.target 都由引擎处理。
 * 3. 普通调用仍用 Reflect.apply，把 this 固定为 context。
 *
 * ——— 示例 ———
 * 输入：const BoundUser = bindComplete(User, null, '小明'); new BoundUser()
 * 输出：User 实例，name 为「小明」
 */
function bindComplete(fn, context, ...boundArgs) {
  if (typeof fn !== 'function') throw new TypeError('fn 必须是函数');

  function bound(...args) {
    const allArgs = boundArgs.concat(args);
    if (new.target) return Reflect.construct(fn, allArgs, new.target);
    return Reflect.apply(fn, context, allArgs);
  }

  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype, {
      constructor: { value: bound, writable: true, configurable: true },
    });
  }
  return bound;
}

/**
 * 延伸 2：补齐 length 和 name 元信息
 *
 * 需求：原生 bind 会把已预置的参数从 length 中扣掉，并把函数名改成 "bound 原名"。
 * 这些字段不影响调用，但调试器、日志和部分框架会读取它们。
 *
 * 思路：基于完整版生成 bound，再用 defineProperty 覆盖可配置的 length / name。
 *
 * ——— 示例 ———
 * 输入：bindWithMetadata(function add(a, b, c) {}, null, 1)
 * 输出：length 为 2，name 为 "bound add"
 */
function bindWithMetadata(fn, context, ...boundArgs) {
  const bound = bindComplete(fn, context, ...boundArgs);
  Object.defineProperties(bound, {
    length: { value: Math.max(0, fn.length - boundArgs.length), configurable: true },
    name: { value: `bound ${fn.name || ''}`, configurable: true },
  });
  return bound;
}

// —— 自测 ——
function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
const bound = greet.myBind({ name: '小明' }, '你好');
console.log(bound('!')); // '你好 小明!'

module.exports = { bindComplete, bindWithMetadata };
