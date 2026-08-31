/**
 * 函数组合 compose / pipe
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：
 *   - compose(f, g, h)(x) 等价于 f(g(h(x)))，从右往左执行；
 *   - pipe(f, g, h)(x) 等价于 h(g(f(x)))，从左往右执行。
 *   redux 的 applyMiddleware、rxjs 的 pipe 都是这个套路。
 *
 * 思路：
 * 1. compose 从右往左喂值，pipe 从左往右。
 * 2. 返回一个函数，reduceRight / reduce 把上一轮结果传给下一个。
 * 3. 一个函数都不传时，reduce 有初值，入参原样回来。
 *
 * ——— 示例 ———
 * const add1 = x => x + 1;
 * const double = x => x * 2;
 * 输入： compose(add1, double)(5)   // 先 double 再 add1
 * 输出： 11
 *
 * 输入： pipe(add1, double)(5)      // 先 add1 再 double
 * 输出： 12
 *
 * ——— 常见追问 ———
 * Q: compose 和 pipe 怎么选？
 * A: 想顺着数据流读（先加 1 再乘 2）用 pipe。数学和 redux 习惯 compose，从右往左。
 *
 * Q: 一个函数都不传会怎样？
 * A: reduce 给了初值 x，空数组直接把 x 返回去，相当于恒等函数。
 *
 * Q: 为什么 compose 用 reduceRight？
 * A: compose(f, g, h)(x) 要先跑 h。reduceRight 从数组尾巴往头喂，正好对上。
 *
 * Q: 某一步返回 Promise 怎么办？
 * A: 同步版会把 Promise 对象当普通值传给下一个，接着就算错。要异步组合就 await 每一拍。
 *
 * Q: 想让第一个函数吃多个参数怎么办？
 * A: 返回函数改成 (...args)，第一次先 fns[最内层](...args)，后面仍单值传递。
 */

function compose(...fns) {
  return function (x) {
    return fns.reduceRight((v, fn) => fn(v), x); // 初值 x，空列表时就是恒等
  };
}

function pipe(...fns) {
  return function (x) {
    return fns.reduce((v, fn) => fn(v), x); // 和阅读数据流的顺序一致
  };
}

/**
 * 延伸 1：支持入口函数接收多个参数
 *
 * 需求：compose(add1, add)(2, 3) 先让最右边的 add 吃到 2、3，
 *       后面的函数仍只接收上一步的单个返回值。
 *
 * 思路：
 * 1. 空函数列表仍返回恒等函数，此时只返回第一个参数。
 * 2. compose 先取出最右边的函数，用全部 args 调它。
 * 3. 剩余函数再从右向左传递单值。pipe 只需把方向反过来。
 *
 * ——— 示例 ———
 * 输入： composeWithArgs(x => x * 2, (a, b) => a + b)(2, 3)
 * 输出： 10
 */
function composeWithArgs(...fns) {
  return function (...args) {
    if (fns.length === 0) return args[0];
    let index = fns.length - 1;
    let value = fns[index].apply(this, args);
    while (--index >= 0) value = fns[index].call(this, value);
    return value;
  };
}

function pipeWithArgs(...fns) {
  return function (...args) {
    if (fns.length === 0) return args[0];
    let index = 0;
    let value = fns[index].apply(this, args);
    while (++index < fns.length) value = fns[index].call(this, value);
    return value;
  };
}

/**
 * 延伸 2：异步 pipe
 *
 * 需求：任意一步都可以返回普通值或 Promise，下一步必须拿到它兑现后的值。
 * 典型场景：先取用户，再按用户 id 查订单，最后整理展示数据。
 *
 * 思路：
 * 1. 入口函数照常接收全部参数。
 * 2. 从第二步开始，每轮 await 上一步，再把结果交给下一步。
 * 3. async 函数会把同步返回值自动包成已兑现的 Promise，不用分支判断。
 *
 * ——— 示例 ———
 * 输入： await pipeAsync(async x => x + 1, x => x * 2)(5)
 * 输出： 12
 */
function pipeAsync(...fns) {
  return async function (...args) {
    if (fns.length === 0) return args[0];
    let value = await fns[0].apply(this, args);
    for (let i = 1; i < fns.length; i++) {
      value = await fns[i].call(this, value);
    }
    return value;
  };
}

// —— 自测 ——
const add1 = (x) => x + 1;
const double = (x) => x * 2;
console.log(compose(add1, double)(5)); // 11
console.log(pipe(add1, double)(5));    // 12
console.log(composeWithArgs(double, (a, b) => a + b)(2, 3)); // 10

module.exports = {
  compose,
  pipe,
  composeWithArgs,
  pipeWithArgs,
  pipeAsync,
};
