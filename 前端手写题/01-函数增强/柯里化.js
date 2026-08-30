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
 *
 * ——— 延伸 ———
 * - 占位符：lodash 的 `_` 可以 curry(add)(_, 2)(1)，空位留给下次。
 * - 无限柯里化：不看 fn.length，碰到空调用 () 才结算。rest 参数只能走这条。
 * - 反柯里化：把 obj.method 变成 f(obj, ...args)，call / apply 就是在干这事。
 * - 默认参数、rest 不计入 fn.length。这种函数要自己定元数，否则第一次就执行。
 *
 * ——— 常见追问 ———
 * Q: 为什么看 fn.length？
 * A: 形参个数就是「凑够了」的标准。默认参数、rest 不计入，碰到它们 length 会偏小。
 *
 * Q: 和 bind 预置参数有什么关系？
 * A: 都是部分应用。bind 还冻 this；curry 是分批收参，够数才跑。
 *
 * Q: 为什么每次返回新函数还要 apply this？
 * A: 方法被柯里化后可能当方法调。this 得透传，不然丢。
 *
 * Q: (...args) => sum(args) 这种能 curry 吗？
 * A: length 是 0，第一次调用就会执行。无限柯里化（空调用才结算）才适合 rest。
 *
 * Q: 柯里化和偏函数区别？
 * A: 偏函数预置一批就停，返回的函数元数固定少几个。柯里化一直收，直到凑够原函数的参数个数。
 */

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) { // >=：多传的也交给原函数，它自己忽略或当 rest
      return fn.apply(this, args);
    }
    return function (...rest) {
      return curried.apply(this, args.concat(rest)); // 还可能没凑够，继续走同一道门
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
