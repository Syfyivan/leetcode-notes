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
 * ——— 延伸 ———
 * - 异步版：每步可能返回 Promise，reduce 改成 async，await 后再喂下一个。
 *   koa 洋葱圈、redux 中间件都是 compose 把函数一层层包起来。
 * - 多参：只有最内层吃多个入参（compose 最右、pipe 最左），后面都只吃上一步的返回值。
 * - compose(f, g, h) 就是 pipe(h, g, f)。方向反一下，别混着用。
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

// —— 自测 ——
const add1 = (x) => x + 1;
const double = (x) => x * 2;
console.log(compose(add1, double)(5)); // 11
console.log(pipe(add1, double)(5));    // 12

module.exports = { compose, pipe };
