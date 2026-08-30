/**
 * 并发控制 —— 限制同时进行的异步任务数量
 *
 * 优先级：前端 P0 · 全栈 P0
 *
 * 需求：给一组"返回 Promise 的任务函数"和一个上限，
 *   同一时刻最多有"上限"个任务在跑；有任务完成就补下一个进来。
 *   最终 resolve 一个"按原顺序"排列的结果数组。
 *
 * 面试超高频（批量上传、批量请求限流都用它）。
 *
 * 思路：
 * 1. 同时跑的任务不超过 limit，完成一个再补一个。
 * 2. 结果按下标写入，保证和输入顺序一致。
 * 3. 空数组直接 resolve []。某个任务 reject 就整单失败。
 *
 * ——— 示例 ———
 * 输入： 任务 = [耗时300ms产出'a', 耗时100ms产出'b', 耗时200ms产出'c', 耗时100ms产出'd']
 *        并发上限 = 2
 * 过程： 先跑 a、b 两个；b 先完成就补 c；a 完成再补 d……
 * 输出： 全部完成后 resolve -> ['a', 'b', 'c', 'd']   （顺序和输入一致）
 */

function concurrencyControl(tasks, limit) {
  return new Promise((resolve, reject) => {
    const n = tasks.length;
    if (n === 0) {
      resolve([]);
      return;
    }
    const results = new Array(n);
    let next = 0;
    let running = 0;
    let done = 0;

    function run() {
      while (running < limit && next < n) {
        const i = next++;
        running++;
        Promise.resolve()
          .then(() => tasks[i]())
          .then((val) => {
            results[i] = val; // 按下标填，谁先完成都不打乱顺序
            running--;
            done++;
            if (done === n) resolve(results);
            else run();
          })
          .catch(reject);
      }
    }

    run();
  });
}

// —— 自测 ——
const make = (x, ms) => () => new Promise((r) => setTimeout(() => r(x), ms));
concurrencyControl(
  [make('a', 300), make('b', 100), make('c', 200), make('d', 100)],
  2
).then((res) => console.log(res)); // ['a', 'b', 'c', 'd']

module.exports = { concurrencyControl };
