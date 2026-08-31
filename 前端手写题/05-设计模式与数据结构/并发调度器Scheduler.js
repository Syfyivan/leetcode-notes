/**
 * 并发调度器 Scheduler（限制最大并发数）
 *
 * 优先级：前端 P0 · 全栈 P0
 *
 * 需求：实现 Scheduler 类，控制同时运行的异步任务不超过 max 个：
 *   - add(task) 接收一个返回 Promise 的函数，返回该任务完成的 Promise；
 *   - 任意任务完成后，立刻从等待队列取下一个补位。
 *   批量请求限流的经典压轴题，字节 / 阿里 / 腾讯高频（出现率 ~90%）。
 *
 * 思路：
 * 1. add 把任务包成"执行完再补位"的函数，推进等待队列，返回一个 Promise。
 * 2. running < max 就立刻取出执行，否则留在队列里。
 * 3. 任务 finally 里 running--，再拉下一个。
 * 4. 边界 / 易错：add 返回的 Promise 要接到任务本身的结果上；max 从 constructor 参数读。
 *
 * ——— 示例 ———
 * 输入： max = 2，依次 add 4 个耗时分别为 1000/500/300/400ms 的任务
 * 输出： 完成顺序 2 → 3 → 1 → 4（任意时刻并发不超过 2）
 *
 * ——— 常见追问 ———
 * Q: add 返回的 Promise 和任务自己的 Promise 什么关系？
 * A: 外包那层把任务的成功/失败原样转出去。调用方 await add() 才能拿到结果或接到拒绝。
 *
 * Q: 为什么用 Promise.resolve().then(task)？
 * A: task 可能同步 throw，也可能忘了返回 Promise。包一层，同步异常也进拒绝，
 *    finally 仍会跑，工位不会卡死。
 *
 * Q: 任务失败还要不要补下一个？
 * A: 要。失败也算占用结束。finally 里 running-- 再 next，跟成功同一条路。
 *
 * Q: 先 push 再 next，会不会超出 max？
 * A: 不会。next 先看 running >= max。满了只是把函数丢在 queue 里，等 finally 再捞。
 */

class Scheduler {
  constructor(max) {
    if (!Number.isInteger(max) || max < 1) {
      throw new RangeError('max 必须是正整数');
    }
    this.max = max;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        this.running++; // 真正开跑才占位，排队时不占
        Promise.resolve()
          .then(task) // 同步 throw 也变成拒绝，finally 还能跑
          .then(resolve, reject)
          .finally(() => {
            this.running--;
            this.next(); // 无论成败都补位
          });
      });
      this.next(); // 有空位就立刻开工，没空就待在 queue
    });
  }

  next() {
    if (this.running >= this.max) return; // 满了先走，别超发
    const job = this.queue.shift();
    if (job) job();
  }
}

/**
 * 延伸 1：暂停 / 恢复
 *
 * 需求：pause 后不再启动排队任务，已经运行的任务继续完成；resume 后立即填满空闲工位。
 *
 * 思路：覆盖 next，在 paused 时直接返回；恢复时循环调用父类 next，直到工位填满。
 *
 * ——— 示例 ———
 * 输入：scheduler.pause(); add(a); add(b); scheduler.resume()
 * 输出：暂停期间 a、b 都不启动；恢复后按并发上限启动
 */
class PausableScheduler extends Scheduler {
  constructor(max) {
    super(max);
    this.paused = false;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    while (this.running < this.max && this.queue.length > 0) super.next();
  }

  next() {
    if (!this.paused) super.next();
  }
}

/**
 * 延伸 2：任务超时 + AbortSignal
 *
 * 需求：每项任务最多运行 timeout 毫秒。超时后拒绝 add 返回的 Promise，
 * 并 abort 内部 signal；任务愿意监听 signal 时可真正停止底层工作。
 *
 * 思路：任务和超时 Promise 做 race，finally 清 timer。超时也会走 Scheduler 的 finally，
 * 正确释放并发工位。
 *
 * ——— 示例 ———
 * 输入：scheduler.add(signal => fetch(url,{signal}), 1000)
 * 输出：一秒未完成则 reject TimeoutError，并取消 fetch
 */
class TimeoutScheduler extends PausableScheduler {
  add(task, timeout) {
    if (timeout === undefined) return super.add(task);
    return super.add(() => {
      const controller = new AbortController();
      let timer;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error(`任务超过 ${timeout}ms`);
          error.name = 'TimeoutError';
          controller.abort(error);
          reject(error);
        }, timeout);
      });
      return Promise.race([
        Promise.resolve().then(() => task(controller.signal)),
        timeoutPromise,
      ]).finally(() => clearTimeout(timer));
    });
  }
}

// —— 自测 ——
const scheduler = new Scheduler(2);
const timeout = (ms) => new Promise((r) => setTimeout(r, ms));
const order = [];
const task = (ms, id) => () => timeout(ms).then(() => order.push(id));

Promise.all([
  scheduler.add(task(1000, 1)),
  scheduler.add(task(500, 2)),
  scheduler.add(task(300, 3)),
  scheduler.add(task(400, 4)),
]).then(() => console.log(order.join(''))); // 2314

module.exports = { Scheduler, PausableScheduler, TimeoutScheduler };
