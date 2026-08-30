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
 *
 * ——— 延伸 ———
 * - 和 Runner 同构。Runner 没有 sleepFirst，多了 wait 写在链中间。
 * - 改 Promise 链：this.queue = this.queue.then(task)。sleepFirst 不好做，
 *   因为 then 已经挂上的环摘不下来，还是数组 + unshift 更顺。
 * - queueMicrotask 替换 setTimeout(0)，启动更贴同步链结束的那一拍。
 *
 * ——— 常见追问 ———
 * Q: 为什么 Hi 不能在 constructor 里立刻打印？
 * A: sleepFirst 要插到 Hi 前面。Hi 若已经打出来，unshift 也救不了。
 *    所以打招呼也是队列里的第一项，sleepFirst 才能插到它前面。
 *
 * Q: sleep 里为什么不 next()？
 * A: next 会立刻取出下一项。sleep 要先空等，到点再 next，把「交棒」交给定时器。
 *
 * Q: 连续两个 sleepFirst 谁先执行？
 * A: 都是 unshift，后写的睡在更前面。sleepFirst(2).sleepFirst(1) 会先等 1 秒再等 2 秒。
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
      setTimeout(() => this.next(), sec * 1000); // 到点才交棒，这里不能立刻 next
    });
    return this;
  }

  sleepFirst(sec) {
    this.queue.unshift(() => { // 插队到最前，排在 Hi 前面
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
