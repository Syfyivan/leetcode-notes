/**
 * 手写 Promise.race / allSettled
 *
 * 优先级：前端 P2 · 全栈 P1
 *
 * race：多个 promise 里，谁先敲定（成功或失败）就用谁的结果。
 * allSettled：等所有 promise 都敲定，返回每个的状态与结果
 *   （成功 { status: 'fulfilled', value }，失败 { status: 'rejected', reason }），永不 reject。
 *
 * ——— 示例 ———
 * race 输入： [ 200ms 后 resolve('slow'), 50ms 后 resolve('fast') ]
 * race 输出： 'fast'   （最快敲定的胜出）
 *
 * allSettled 输入： [ Promise.resolve(1), Promise.reject('err') ]
 * allSettled 输出： [ {status:'fulfilled', value:1}, {status:'rejected', reason:'err'} ]
 */

function promiseRace() {
}

function promiseAllSettled() {
}

// —— 自测 ——
promiseRace([
  new Promise((r) => setTimeout(() => r('slow'), 200)),
  new Promise((r) => setTimeout(() => r('fast'), 50)),
]).then((v) => console.log(v)); // 'fast'

promiseAllSettled([
  Promise.resolve(1),
  Promise.reject('err'),
]).then((v) => console.log(v));
// [{status:'fulfilled',value:1}, {status:'rejected',reason:'err'}]

module.exports = { promiseRace, promiseAllSettled };
