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
 */

Array.prototype.myMap = function (fn) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(fn(this[i], i, this));
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
  if (arguments.length < 2) {
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
