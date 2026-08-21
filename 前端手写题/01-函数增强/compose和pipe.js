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
 * ——— 示例 ———
 * const add1 = x => x + 1;
 * const double = x => x * 2;
 * 输入： compose(add1, double)(5)   // 先 double 再 add1
 * 输出： 11
 *
 * 输入： pipe(add1, double)(5)      // 先 add1 再 double
 * 输出： 12
 */

function compose() {
}

function pipe() {
}

// —— 自测 ——
const add1 = (x) => x + 1;
const double = (x) => x * 2;
console.log(compose(add1, double)(5)); // 11
console.log(pipe(add1, double)(5));    // 12

module.exports = { compose, pipe };
