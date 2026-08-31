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
 * 两套写法，行为一致：
 *   Runner          方案一：任务数组 + setTimeout(0) 延迟启动（和 LazyMan 同构）
 *   RunnerPromise   方案二：Promise 链。每次入队挂一个 then，不必自己 flush
 *
 * 思路（方案一）：
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
 *
 * ——— 常见追问 ———
 * Q: wait 会不会触发 flush？
 * A: 不会。wait 只是把「以后要等 n 秒」推进数组。真正开跑的是 constructor
 *    里那一次 setTimeout(0) / queueMicrotask。wait 影响的是跑到这一项时要不要停。
 *
 * Q: 构造函数一开始就执行，flush 不是马上就跑了？
 * A: 执行的是 queueMicrotask / setTimeout 这一行，只挂号，不调用 _flush。
 *    整句点号还占着调用栈，微任务/宏任务都插不进来。链写完栈空了才 flush。
 *
 * Q: 方法的 return 和回调的 return 是一回事吗？
 * A: 不是。方法 return this，为了还能 .run().wait()。
 *    回调 return Promise，为了让队列 await / then 等完再走下一步。
 *    run 的回调打完 log 就结束，不用 return；wait 忘了 return Promise，延时就废了。
 *
 * Q: Promise 链为什么不用 setTimeout(0)？
 * A: 第一次 .then 已经把「开始任务」推进微任务。后面的 .run().wait() 还在同步阶段
 *    往同一条 Promise 上继续挂 then，赶在回调跑起来之前接完电线。
 */

// ============================================================
// 方案一：任务数组
// ============================================================

class Runner {
  constructor(name) {
    this.queue = [];
    this.aborted = false;
    this.errorHandler = null;
    this.queue.push(() => {
      console.log(`开始任务「${name}」`);
      this.next();
    });
    // 只挂号。整句 .run().wait() 还在同步栈上，到点才会 next
    setTimeout(() => this.next(), 0);
  }

  next() {
    if (this.aborted) return;
    const task = this.queue.shift();
    if (!task) return;
    try {
      task();
    } catch (error) {
      if (this.errorHandler) this.errorHandler(error);
      else throw error;
    }
  }

  run(step) {
    this.queue.push(() => {
      console.log(`执行「${step}」`);
      this.next(); // 同步步骤，打完立刻下一步
    });
    return this; // 链式点号要的是实例，不是任务结果
  }

  wait(sec) {
    this.queue.push(() => {
      // 这里不立刻 next，等定时器到点再交棒
      setTimeout(() => this.next(), sec * 1000);
    });
    return this;
  }
}

/**
 * 延伸 1：waitFirst
 *
 * 需求：把等待任务插到队首，比“开始任务”更早执行。
 *
 * 思路：和 LazyMan.sleepFirst 一样使用 unshift；同步链写完前队列尚未启动。
 *
 * ——— 示例 ———
 * 输入：new Runner('A').run('1').waitFirst(1)
 * 输出：先等一秒，再打印开始任务和步骤 1
 */
Runner.prototype.waitFirst = function (sec) {
  this.queue.unshift(() => setTimeout(() => this.next(), sec * 1000));
  return this;
};

/**
 * 延伸 2：取消与同步错误处理
 *
 * 需求：cancel 清掉尚未执行的任务；onError 捕获 run 回调同步抛出的错误。
 * 当前已启动的定时器不会被强制取消，但到点后的 next 会因 aborted 直接返回。
 */
Runner.prototype.cancel = function () {
  this.aborted = true;
  this.queue.length = 0;
  return this;
};

Runner.prototype.onError = function (handler) {
  this.errorHandler = handler;
  return this;
};

// ============================================================
// 方案二：Promise 链（延伸）
// 方法 return this；丢进 then 的回调，wait 必须 return Promise
// ============================================================

class RunnerPromise {
  constructor(name) {
    this.aborted = false;
    this.queue = Promise.resolve();
    this._enqueue(() => {
      console.log(`开始任务「${name}」`);
    });
  }

  _enqueue(task) {
    this.queue = this.queue.then(() => {
      if (!this.aborted) return task();
      return undefined;
    });
    return this;
  }

  run(step) {
    return this._enqueue(() => {
      console.log(`执行「${step}」`);
      // 没有 return → undefined，then 立刻走下一步
    });
  }

  wait(sec) {
    return this._enqueue(
      () => new Promise((resolve) => setTimeout(resolve, sec * 1000))
      // 必须 return 这个 Promise，then 才会卡住
    );
  }

  cancel() {
    this.aborted = true;
    return this;
  }

  catch(handler) {
    this.queue = this.queue.catch(handler);
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

module.exports = { Runner, RunnerPromise };
