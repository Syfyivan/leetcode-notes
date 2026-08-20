/**
 * 柯里化 curry
 *
 * 需求：把一个多参函数变成"可以分批传参"的函数。
 *   - 参数没凑够原函数需要的个数时，返回一个继续收参的新函数；
 *   - 凑够了就执行并返回结果。
 *
 * ——— 示例 ———
 * 原函数： add(a, b, c) => a + b + c
 * 输入： curried(1)(2)(3)   输出： 6
 * 输入： curried(1, 2)(3)   输出： 6
 * 输入： curried(1)(2, 3)   输出： 6
 */

function curry() {
}

// —— 自测 ——
const add = (a, b, c) => a + b + c;
const curried = curry(add);
console.log(curried(1)(2)(3)); // 6
console.log(curried(1, 2)(3)); // 6
console.log(curried(1)(2, 3)); // 6

module.exports = { curry };
