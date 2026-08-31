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

/**
 * 延伸 1：支持占位符
 *
 * 需求：允许先跳过某个位置，后续调用再补。例如 curryPlaceholder(add)(_, 2)(1, 3)。
 *
 * 思路：
 * 1. 用唯一 Symbol 表示空位，避免和业务参数撞值。
 * 2. 新参数优先从左往右填旧空位，剩余参数追加到末尾。
 * 3. 前 arity 项都没有空位且数量足够时，才执行原函数。
 *
 * ——— 示例 ———
 * 输入：curryPlaceholder(add)(placeholder, 2)(1, 3)
 * 输出：6
 */
const placeholder = Symbol('curry placeholder');

function curryPlaceholder(fn, arity = fn.length) {
  function collect(collected, ctx) {
    return function (...incoming) {
      const nextCtx = ctx === undefined ? this : ctx;
      const merged = collected.slice();
      let incomingIndex = 0;

      for (let i = 0; i < merged.length && incomingIndex < incoming.length; i++) {
        if (merged[i] === placeholder && incoming[incomingIndex] !== placeholder) {
          merged[i] = incoming[incomingIndex++];
        }
      }
      merged.push(...incoming.slice(incomingIndex));

      const ready = merged.length >= arity
        && merged.slice(0, arity).every((item) => item !== placeholder);
      if (ready) return fn.apply(nextCtx, merged);
      return collect(merged, nextCtx);
    };
  }

  return collect([], undefined);
}

/**
 * 延伸 2：无限参数柯里化
 *
 * 需求：不依赖 fn.length，持续分批收参，遇到空调用时结算。
 * 典型场景：原函数用了 rest 参数，形参长度无法表达需要收多少项。
 *
 * 思路：
 * 1. 闭包保存目前收集的全部参数。
 * 2. 有新参数就返回下一层收集函数。
 * 3. args.length 为 0 时调用 reducer，完成结算。
 *
 * ——— 示例 ———
 * 输入：curryInfinite(nums => nums.reduce((a, b) => a + b, 0))(1)(2, 3)()
 * 输出：6
 */
function curryInfinite(fn) {
  function collect(allArgs) {
    return function (...args) {
      if (args.length === 0) return fn.call(this, allArgs);
      return collect(allArgs.concat(args));
    };
  }
  return collect([]);
}

// —— 自测 ——
const add = (a, b, c) => a + b + c;
const curried = curry(add);
console.log(curried(1)(2)(3)); // 6
console.log(curried(1, 2)(3)); // 6
console.log(curried(1)(2, 3)); // 6
console.log(curryPlaceholder(add)(placeholder, 2)(1, 3)); // 6

module.exports = { curry, curryPlaceholder, curryInfinite, placeholder };
