/**
 * 手写 Array.prototype.map / filter / reduce
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：在 Array.prototype 上实现 myMap / myFilter / myReduce，行为对齐原生：
 *   - myMap(fn)：返回每个元素经 fn 映射后的新数组；
 *   - myFilter(fn)：返回 fn 返回真值的元素组成的新数组；
 *   - myReduce(fn, initial)：从左往右累加，无初值时用第 0 项打底。
 *   三个回调都接收 (item, index, array)。
 *
 * 思路：
 * 1. 自己 for 循环，回调吃 (item, index, array)。
 * 2. map / filter 都返回新数组，不改原数组。
 * 3. reduce 没初值时拿第 0 项当累加器，从下标 1 开始跑。
 *
 * ——— 示例 ———
 * 输入： [1, 2, 3].myMap(x => x * 2)
 * 输出： [2, 4, 6]
 *
 * 输入： [1, 2, 3, 4].myFilter(x => x % 2 === 0)
 * 输出： [2, 4]
 *
 * 输入： [1, 2, 3, 4].myReduce((a, b) => a + b, 0)
 * 输出： 10
 *
 * ——— 延伸 ———
 * - 稀疏数组：原生 map / filter 跳过 empty slot，这份 for 会把洞当 undefined 喂给回调。
 * - thisArg：原生 map(fn, thisArg) 能绑回调 this，手写常省。
 * - reduce 空数组又不传初值，原生抛 TypeError。这份会读到 this[0] 为 undefined 继续跑。
 * - 链式：map / filter 返回新数组才能接着点。reduce 返回的是累加值，链到这就断。
 *
 * ——— 常见追问 ———
 * Q: 为什么不直接改原数组？
 * A: 这三个都是非破坏性方法。调用方还要用原数组，必须另开一份。
 *
 * Q: reduce 不传初值会怎样？
 * A: 第 0 项当累加器，从下标 1 开始。空数组无初值，原生会抛。
 *
 * Q: 为什么回调要传 index 和 array？
 * A: 原生签名就是 (item, index, array)。有人会用下标或看原数组，缺了行为对不上。
 *
 * Q: forEach 和 map 差在哪？
 * A: forEach 为了副作用，返回 undefined。map 为了映射出新数组，才接得上链式。
 *
 * Q: 为什么用 arguments.length 判断初值，不写 initial === undefined？
 * A: 初值完全可以是 undefined。用参数个数才能区分「没传」和「传了 undefined」。
 */

Array.prototype.myMap = function (fn) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(fn(this[i], i, this)); // 签名对齐原生，三项都给
  }
  return res;
};

Array.prototype.myFilter = function (fn) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    if (fn(this[i], i, this)) res.push(this[i]);
  }
  return res;
};

Array.prototype.myReduce = function (fn, initial) {
  let acc = initial;
  let i = 0;
  if (arguments.length < 2) { // undefined 也是合法初值，不能用 === undefined 判断
    acc = this[0];
    i = 1;
  }
  for (; i < this.length; i++) {
    acc = fn(acc, this[i], i, this);
  }
  return acc;
};

// —— 自测 ——
console.log([1, 2, 3].myMap((x) => x * 2));             // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter((x) => x % 2 === 0)); // [2, 4]
console.log([1, 2, 3, 4].myReduce((a, b) => a + b, 0)); // 10

module.exports = {};
