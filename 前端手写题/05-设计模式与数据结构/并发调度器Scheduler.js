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
 */

class Scheduler {
  constructor(max) {
    this.max = max;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        this.running++;
        Promise.resolve()
          .then(task)
          .then(resolve, reject)
          .finally(() => {
            this.running--;
            this.next();
          });
      });
      this.next();
    });
  }

  next() {
    if (this.running >= this.max) return;
    const job = this.queue.shift();
    if (job) job();
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

module.exports = { Scheduler };
