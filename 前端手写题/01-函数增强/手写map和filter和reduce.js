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

Array.prototype.myMap = function () {
};

Array.prototype.myFilter = function () {
};

Array.prototype.myReduce = function () {
};

// —— 自测 ——
console.log([1, 2, 3].myMap((x) => x * 2));             // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter((x) => x % 2 === 0)); // [2, 4]
console.log([1, 2, 3, 4].myReduce((a, b) => a + b, 0)); // 10

module.exports = {};
