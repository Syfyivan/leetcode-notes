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

/**
 * 延伸 1：处理稀疏数组、thisArg 和类数组
 *
 * 需求：更贴近原生 map / filter：
 *   - 跳过稀疏数组的 empty slot；
 *   - 回调支持 thisArg；
 *   - 可处理 arguments、NodeList 等类数组。
 *
 * 思路：
 * 1. Object(arrayLike) 统一包装输入，length 转成非负整数。
 * 2. 用 i in source 判断该下标是否真的存在。
 * 3. map 保留原长度和空洞；filter 只 push 命中的现有元素。
 *
 * ——— 示例 ———
 * 输入：mapLike([1, , 3], x => x * 2)
 * 输出：[2, <empty>, 6]
 */
function toLength(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.min(Math.floor(number), Number.MAX_SAFE_INTEGER);
}

function mapLike(arrayLike, callback, thisArg) {
  if (arrayLike == null) throw new TypeError('不能遍历 null 或 undefined');
  if (typeof callback !== 'function') throw new TypeError('callback 必须是函数');
  const source = Object(arrayLike);
  const length = toLength(source.length);
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    if (i in source) result[i] = callback.call(thisArg, source[i], i, source);
  }
  return result;
}

function filterLike(arrayLike, callback, thisArg) {
  if (arrayLike == null) throw new TypeError('不能遍历 null 或 undefined');
  if (typeof callback !== 'function') throw new TypeError('callback 必须是函数');
  const source = Object(arrayLike);
  const length = toLength(source.length);
  const result = [];
  for (let i = 0; i < length; i++) {
    if (i in source && callback.call(thisArg, source[i], i, source)) {
      result.push(source[i]);
    }
  }
  return result;
}

/**
 * 延伸 2：对齐 reduce 的空数组和稀疏数组规则
 *
 * 需求：无初值时寻找第一个真实存在的元素打底；一个元素都找不到就抛 TypeError。
 *
 * 思路：
 * 1. arguments.length 判断调用方是否真的传了 initialValue。
 * 2. 没传初值就向右寻找第一个 i in source 的元素。
 * 3. 后续循环仍跳过空洞。
 *
 * ——— 示例 ———
 * 输入：reduceLike([, 2, 3], (sum, n) => sum + n)
 * 输出：5
 */
function reduceLike(arrayLike, callback, ...initial) {
  if (arrayLike == null) throw new TypeError('不能遍历 null 或 undefined');
  if (typeof callback !== 'function') throw new TypeError('callback 必须是函数');
  const source = Object(arrayLike);
  const length = toLength(source.length);
  let index = 0;
  let accumulator;

  if (initial.length > 0) {
    [accumulator] = initial;
  } else {
    while (index < length && !(index in source)) index++;
    if (index >= length) throw new TypeError('空数组且没有初始值');
    accumulator = source[index++];
  }

  for (; index < length; index++) {
    if (index in source) {
      accumulator = callback(accumulator, source[index], index, source);
    }
  }
  return accumulator;
}

// —— 自测 ——
console.log([1, 2, 3].myMap((x) => x * 2));             // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter((x) => x % 2 === 0)); // [2, 4]
console.log([1, 2, 3, 4].myReduce((a, b) => a + b, 0)); // 10

module.exports = { mapLike, filterLike, reduceLike };
