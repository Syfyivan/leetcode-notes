/**
 * 数组分组 groupBy
 *
 * 优先级：前端 P2 · 全栈 P2
 *
 * 需求：实现 groupBy(arr, iteratee)，按 iteratee 的返回值把元素分组：
 *   - iteratee 是函数：用其返回值作分组 key；
 *   - iteratee 是字符串：按元素的该属性值分组。
 *   返回 { key: [...items] } 结构。
 *
 * 思路：
 * 1. iteratee 是函数就直接调，是字符串就取 item[iteratee] 当分组键。
 * 2. 准备一个对象，这个 key 还没有就先建空数组，再 push。
 * 3. 边界 / 易错：对象的键会被转成字符串，Math.floor(6.1) 得到 6，打印出来是 '6'。
 *
 * ——— 示例 ———
 * 输入： groupBy([6.1, 4.2, 6.3], Math.floor)
 * 输出： { '4': [4.2], '6': [6.1, 6.3] }
 *
 * 输入： groupBy([{ t: 'a' }, { t: 'b' }, { t: 'a' }], 't')
 * 输出： { a: [{t:'a'}, {t:'a'}], b: [{t:'b'}] }
 */

function groupBy(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (item) => item[iteratee];
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    const key = fn(arr[i]);
    if (!res[key]) res[key] = [];
    res[key].push(arr[i]);
  }
  return res;
}

// —— 自测 ——
console.log(groupBy([6.1, 4.2, 6.3], Math.floor));
// { '4': [4.2], '6': [6.1, 6.3] }
console.log(groupBy([{ t: 'a' }, { t: 'b' }, { t: 'a' }], 't'));
// { a: [{t:'a'}, {t:'a'}], b: [{t:'b'}] }

module.exports = { groupBy };
