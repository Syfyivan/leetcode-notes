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
 *
 * ——— 延伸 ———
 * - 用 Map 当分桶，key 能是数字 / 对象，不会被 toString。ES2024 的 Object.groupBy
 *   返回无原型对象，也是字符串键。
 * - iteratee 拿 (item, index, arr) 三个参数，lodash 就是这样。
 * - 按多个字段分：key 拼成 `${dept}-${role}`，或者嵌套再 groupBy 一次。
 *
 * ——— 常见追问 ———
 * Q: 为什么 Math.floor 的结果打印出来是 '6'？
 * A: 对象的键一律字符串。6 和 '6' 是同一个桶。要保住类型就换 Map。
 *
 * Q: key 是 undefined / null 怎么办？
 * A: 一样进 'undefined'、'null' 两个桶。一般题目不卡。
 *
 * Q: 会改原数组吗？
 * A: 不会。桶里放的是原元素引用，改对象字段两边都能看到，数组本身没动。
 *
 * Q: 稀疏数组的空洞呢？
 * A: for i 会走到空洞，item 是 undefined，按 undefined 分组。
 *    forEach / for...of 会跳过空洞。
 */

function groupBy(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (item) => item[iteratee]; // 字符串当属性名，后面只走一条路
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    const key = fn(arr[i]);
    if (!res[key]) res[key] = []; // 这个 key 第一次出现才建桶
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
