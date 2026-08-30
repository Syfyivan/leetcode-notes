/**
 * 链式任务 Runner（任务队列 + 链式调用）
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 场景：模型生成了一个执行计划，前端要按链式描述顺序执行。
 * 需求：实现 Runner 类：
 *   - new Runner(name)  开始任务，打印 开始任务「name」
 *   - run(step)         按顺序执行一步，打印 执行「step」
 *   - wait(sec)         等待 sec 秒再继续下一步
 *   所有方法返回 this，支持链式调用。
 *   考点：和 LazyMan 同构。
 *
 * 思路：
 * 1. new Runner().run().wait().run() 这串会同步跑完。wait 却要真等几秒，
 *    所以不能在调用当下执行，先把每一步推进队列。
 * 2. constructor 里用 setTimeout(0) 把"开始跑队列"推到下一轮宏任务，
 *    等同步链把 run/wait 都入队之后，再 next。
 * 3. run 入队：打印完立刻 next。wait 入队：setTimeout 到点再 next。
 * 4. 每个方法都 return this，链才能接下去。
 *
 * ——— 示例 ———
 * 输入：
 *   new Runner('总结文档')
 *     .run('提取关键词')
 *     .wait(2)
 *     .run('生成摘要')
 *     .wait(1)
 *     .run('写入笔记');
 * 输出（依次打印）：
 *   开始任务「总结文档」
 *   执行「提取关键词」
 *   （等 2 秒）
 *   执行「生成摘要」
 *   （等 1 秒）
 *   执行「写入笔记」
 */

class Runner {
  constructor(name) {
    this.queue = [];
    this.queue.push(() => {
      console.log(`开始任务「${name}」`);
      this.next();
    });
    // 同步链还没排完，先把启动推到下一轮
    setTimeout(() => this.next(), 0);
  }

  next() {
    const task = this.queue.shift();
    if (task) task();
  }

  run(step) {
    this.queue.push(() => {
      console.log(`执行「${step}」`);
      this.next();
    });
    return this;
  }

  wait(sec) {
    this.queue.push(() => {
      setTimeout(() => this.next(), sec * 1000);
    });
    return this;
  }
}

// —— 自测 ——
new Runner('总结文档')
  .run('提取关键词')
  .wait(2)
  .run('生成摘要')
  .wait(1)
  .run('写入笔记');
// 开始任务「总结文档」→ 执行「提取关键词」→ (2秒后) 执行「生成摘要」→ (1秒后) 执行「写入笔记」

module.exports = { Runner };
