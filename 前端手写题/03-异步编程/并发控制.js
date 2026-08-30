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
 *
 * ——— 延伸 ———
 * - 失败策略：现在是一个挂全部挂。也可以记下来继续跑，最后一起交卷。
 * - 和 Scheduler 的差别：这份吃整表任务，Scheduler.add 是一个一个投。
 * - 超时：每个任务再 race 一个 sleep reject。
 *
 * ——— 常见追问 ———
 * Q: 为什么结果按下标写？
 * A: 完成顺序和输入顺序不一样。push 会按谁先结束谁排前。下标锁死位置。
 *
 * Q: 某个任务 reject 了，已经发出的怎么办？
 * A: 外层已经失败，发出去的请求停不下来，结果被丢掉。真取消得任务自己吃 AbortSignal。
 *
 * Q: 空数组为什么要提前 resolve？
 * A: n===0 时 while 进不去，done 永远到不了 n，会一直 pending。
 *
 * Q: 为什么包一层 Promise.resolve().then(() => tasks[i]())？
 * A: tasks[i]() 同步 throw 会打到 run 外面。包一下，同步错误也进 catch。
 *
 * Q: limit 比任务数还大呢？
 * A: while 有 next < n，不会凭空多跑。等于没限流。
 */

function concurrencyControl(tasks, limit) {
  return new Promise((resolve, reject) => {
    const n = tasks.length;
    if (n === 0) {
      resolve([]);
      return; // 否则 while 进不去，done 到不了 n，一直 pending
    }
    const results = new Array(n);
    let next = 0;
    let running = 0;
    let done = 0;

    function run() {
      while (running < limit && next < n) { // 空槽有几补几，第一次进来要填满 limit
        const i = next++;
        running++;
        Promise.resolve()
          .then(() => tasks[i]()) // 同步 throw 也变成 reject，不会打到 run 外面
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
