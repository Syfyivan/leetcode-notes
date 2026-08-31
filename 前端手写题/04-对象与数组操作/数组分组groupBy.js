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

/**
 * 延伸 1：Map 分组，保留 key 类型
 *
 * 需求：iteratee 返回数字、对象或 Symbol 时，分组 key 不被强制转成字符串。
 *
 * 思路：Map 按 SameValueZero 保存 key；iteratee 接收 item、index、array 三个参数。
 *
 * ——— 示例 ———
 * 输入：groupByMap([1.2, 1.8, 2.1], Math.floor)
 * 输出：Map 中数字 1 对应 [1.2,1.8]，数字 2 对应 [2.1]
 */
function groupByMap(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (item) => item[iteratee];
  const result = new Map();
  arr.forEach((item, index) => {
    const key = fn(item, index, arr);
    if (!result.has(key)) result.set(key, []);
    result.get(key).push(item);
  });
  return result;
}

/**
 * 延伸 2：按多个字段嵌套分组
 *
 * 需求：依次按多个 iteratee 建嵌套 Map，最后一层的 value 是元素数组。
 * 典型场景：先按部门分，再按角色分。
 *
 * 思路：递归消费 iteratees；每层先 groupByMap，再对每个桶继续分下一层。
 *
 * ——— 示例 ———
 * 输入：groupByMany(users, ['department', 'role'])
 * 输出：Map<department, Map<role, User[]>>
 */
function groupByMany(arr, iteratees) {
  if (iteratees.length === 0) return arr.slice();
  const [first, ...rest] = iteratees;
  const groups = groupByMap(arr, first);
  if (rest.length === 0) return groups;
  for (const [key, items] of groups) groups.set(key, groupByMany(items, rest));
  return groups;
}

// —— 自测 ——
console.log(groupBy([6.1, 4.2, 6.3], Math.floor));
// { '4': [4.2], '6': [6.1, 6.3] }
console.log(groupBy([{ t: 'a' }, { t: 'b' }, { t: 'a' }], 't'));
// { a: [{t:'a'}, {t:'a'}], b: [{t:'b'}] }

module.exports = { groupBy, groupByMap, groupByMany };
