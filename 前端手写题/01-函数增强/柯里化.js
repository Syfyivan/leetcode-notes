/**
 * 柯里化 curry
 *
 * 优先级：前端 P1 · 全栈 P2
 *
 * 需求：把一个多参函数变成"可以分批传参"的函数。
 *   - 参数没凑够原函数需要的个数时，返回一个继续收参的新函数；
 *   - 凑够了就执行并返回结果。
 *
 * 思路：
 * 1. 参数没凑够 fn.length，就返回继续收参的函数。
 * 2. 每次把新旧参数 concat 起来。
 * 3. 够了再 apply。默认参数、rest 不计入 length。
 *
 * ——— 示例 ———
 * 原函数： add(a, b, c) => a + b + c
 * 输入： curried(1)(2)(3)   输出： 6
 * 输入： curried(1, 2)(3)   输出： 6
 * 输入： curried(1)(2, 3)   输出： 6
 */

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...rest) {
      return curried.apply(this, args.concat(rest));
    };
  };
}

// —— 自测 ——
const add = (a, b, c) => a + b + c;
const curried = curry(add);
console.log(curried(1)(2)(3)); // 6
console.log(curried(1, 2)(3)); // 6
console.log(curried(1)(2, 3)); // 6

module.exports = { curry };
