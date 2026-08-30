/**
 * LazyMan（链式调用 + 任务队列）
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 需求：实现 lazyMan(name)，支持链式调用并按队列顺序执行：
 *   - 立即打印 "Hi! This is <name>!"；
 *   - eat(food)：打印 "Eat <food>~"；
 *   - sleep(sec)：等待 sec 秒再继续；
 *   - sleepFirst(sec)：插到队首，最先等待 sec 秒。
 *   考点：任务队列 + 用 setTimeout(0) 把启动推到下一轮，让链式调用先排完队。
 *
 * 思路：
 * 1. 链式调用是同步的，sleep 却要真等。eat / sleep / 打招呼都先推进队列。
 * 2. constructor 里 setTimeout(0) 启动，等同步链把任务都排完再跑。
 * 3. sleepFirst 用 unshift 插到队头，所以先空等 1 秒，再打印 Hi 和 eat。
 * 4. 边界 / 易错：打招呼也要入队，不能在 constructor 里立刻打印，否则 sleepFirst 插不在它前面。
 *
 * ——— 示例 ———
 * 输入： lazyMan('Tony').eat('lunch').sleepFirst(1).eat('dinner')
 * 输出（1 秒后开始）：
 *   Hi! This is Tony!
 *   Eat lunch~
 *   Eat dinner~
 */

class LazyManClass {
  constructor(name) {
    this.queue = [];
    this.queue.push(() => {
      console.log(`Hi! This is ${name}!`);
      this.next();
    });
    // 同步链还没排完，先把启动推到下一轮
    setTimeout(() => this.next(), 0);
  }

  next() {
    const task = this.queue.shift();
    if (task) task();
  }

  eat(food) {
    this.queue.push(() => {
      console.log(`Eat ${food}~`);
      this.next();
    });
    return this;
  }

  sleep(sec) {
    this.queue.push(() => {
      setTimeout(() => this.next(), sec * 1000);
    });
    return this;
  }

  sleepFirst(sec) {
    this.queue.unshift(() => {
      setTimeout(() => this.next(), sec * 1000);
    });
    return this;
  }
}

function lazyMan(name) {
  return new LazyManClass(name);
}

// —— 自测 ——
lazyMan('Tony').eat('lunch').sleepFirst(1).eat('dinner');
// 1s 后：Hi! This is Tony! / Eat lunch~ / Eat dinner~

module.exports = { lazyMan, LazyManClass };
