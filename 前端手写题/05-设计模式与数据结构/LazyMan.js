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
 * ——— 示例 ———
 * 输入： lazyMan('Tony').eat('lunch').sleepFirst(1).eat('dinner')
 * 输出（1 秒后开始）：
 *   Hi! This is Tony!
 *   Eat lunch~
 *   Eat dinner~
 */

class LazyManClass {
  constructor() {
  }
}

function lazyMan() {
}

// —— 自测 ——
lazyMan('Tony').eat('lunch').sleepFirst(1).eat('dinner');
// 1s 后：Hi! This is Tony! / Eat lunch~ / Eat dinner~

module.exports = { lazyMan, LazyManClass };
