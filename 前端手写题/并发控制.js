/**
 * 并发控制 —— 限制同时进行的异步任务数量
 *
 * 需求：给一组"返回 Promise 的任务函数"和一个上限，
 *   同一时刻最多有"上限"个任务在跑；有任务完成就补下一个进来。
 *   最终 resolve 一个"按原顺序"排列的结果数组。
 *
 * 面试超高频（批量上传、批量请求限流都用它）。
 *
 * ——— 示例 ———
 * 输入： 任务 = [耗时300ms产出'a', 耗时100ms产出'b', 耗时200ms产出'c', 耗时100ms产出'd']
 *        并发上限 = 2
 * 过程： 先跑 a、b 两个；b 先完成就补 c；a 完成再补 d……
 * 输出： 全部完成后 resolve -> ['a', 'b', 'c', 'd']   （顺序和输入一致）
 */

function concurrencyControl() {
}

// —— 自测 ——
const make = (x, ms) => () => new Promise((r) => setTimeout(() => r(x), ms));
concurrencyControl(
  [make('a', 300), make('b', 100), make('c', 200), make('d', 100)],
  2
).then((res) => console.log(res)); // ['a', 'b', 'c', 'd']

module.exports = { concurrencyControl };
