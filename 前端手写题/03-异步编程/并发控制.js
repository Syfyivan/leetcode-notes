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
    if (!Number.isInteger(limit) || limit < 1) {
      reject(new RangeError('limit 必须是正整数'));
      return;
    }
    const n = tasks.length;
    if (n === 0) {
      resolve([]);
      return; // 否则 while 进不去，done 到不了 n，一直 pending
    }
    const results = new Array(n);
    let next = 0;
    let running = 0;
    let done = 0;
    let failed = false;

    function run() {
      while (!failed && running < limit && next < n) { // 空槽有几补几，第一次进来要填满 limit
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
          .catch((error) => {
            failed = true; // 已经失败后不再启动队列里尚未开始的任务
            reject(error);
          });
      }
    }

    run();
  });
}

/**
 * 延伸 1：失败后继续，收集全部结局
 *
 * 需求：某个任务失败不影响后续任务启动，最终按输入顺序返回 fulfilled / rejected 结果。
 * 典型场景：批量上传时需要展示每个文件各自成功还是失败。
 *
 * 思路：
 * 1. 启动 min(limit, tasks.length) 个 worker。
 * 2. 每个 worker 用共享 next 领取下标，完成后继续领下一项。
 * 3. worker 内部 catch 错误并写入结果，因此 Promise.all(workers) 不会提前失败。
 *
 * ——— 示例 ———
 * 输入：成功任务、失败任务、成功任务，limit=2
 * 输出：三个状态按原输入顺序排列，失败项带 reason
 */
async function concurrencyAllSettled(tasks, limit) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit 必须是正整数');
  }
  const results = new Array(tasks.length);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const index = next++;
      try {
        const value = await tasks[index]();
        results[index] = { status: 'fulfilled', value };
      } catch (reason) {
        results[index] = { status: 'rejected', reason };
      }
    }
  }

  const workerCount = Math.min(limit, tasks.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

/**
 * 延伸 2：给每个任务加超时
 *
 * 需求：单个任务超过 timeout 毫秒就视为失败，避免它永久占住一个并发槽。
 *
 * 思路：每个任务和一个超时拒绝 Promise 做 race，再复用基础并发控制器。
 * 注意：race 只能让外层不再等待，已经发出的请求仍需 AbortSignal 才能真正取消。
 *
 * ——— 示例 ———
 * 输入：任务耗时 500ms，timeout=100
 * 输出：约 100ms 后以 TimeoutError 拒绝
 */
function concurrencyWithTimeout(tasks, limit, timeout) {
  const wrapped = tasks.map((task) => () => {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const error = new Error(`任务超过 ${timeout}ms`);
        error.name = 'TimeoutError';
        reject(error);
      }, timeout);
    });
    return Promise.race([Promise.resolve().then(task), timeoutPromise])
      .finally(() => clearTimeout(timer));
  });
  return concurrencyControl(wrapped, limit);
}

// —— 自测 ——
const make = (x, ms) => () => new Promise((r) => setTimeout(() => r(x), ms));
concurrencyControl(
  [make('a', 300), make('b', 100), make('c', 200), make('d', 100)],
  2
).then((res) => console.log(res)); // ['a', 'b', 'c', 'd']

module.exports = {
  concurrencyControl,
  concurrencyAllSettled,
  concurrencyWithTimeout,
};
