/**
 * 数组去重
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 输入：任意数组（可能含重复的原始值）。
 * 输出：去掉重复项后的新数组，保持首次出现的顺序。
 *
 * 思路：
 * 1. 丢进 Set，插入时自动去重，而且按插入顺序排。
 * 2. 展开成新数组，原数组不动。
 * 3. 边界 / 易错：原始值没问题；对象是按引用比，两个长得一样的 {} 不会被当成重复。
 *
 * ——— 示例 ———
 * 输入： [1, 1, 2, 3, 3, 3, 4]      输出： [1, 2, 3, 4]
 * 输入： ['a', 'b', 'a', 'c']       输出： ['a', 'b', 'c']
 *
 * ——— 常见追问 ———
 * Q: 两个长得一样的 {} 为啥不去掉一个？
 * A: Set 按 SameValueZero，对象比引用。每次字面量都是新地址。
 *
 * Q: NaN 能去重吗？
 * A: 能。Set 里 NaN 等于 NaN。indexOf 那套 === 就不行。
 *
 * Q: +0 和 -0？
 * A: Set 当成同一个。Object.is 才分得开。
 *
 * Q: 为啥能保住第一次出现的顺序？
 * A: ES6 起 Set 按插入序迭代。后到的重复项根本插不进去。
 */

function unique(arr) {
  return [...new Set(arr)]; // Set 按插入序去重，展开才是新数组
}

/**
 * 延伸 1：按字段或计算结果去重 uniqueBy
 *
 * 需求：对象数组按 id 等业务键去重，保留每个 key 第一次出现的元素。
 * iteratee 可传函数，也可传属性名。
 *
 * 思路：Set 只保存 iteratee 算出的 key；key 没见过才把原元素推入结果。
 *
 * ——— 示例 ———
 * 输入：uniqueBy([{id:1,n:'a'}, {id:1,n:'b'}, {id:2,n:'c'}], 'id')
 * 输出：保留第一和第三项
 */
function uniqueBy(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (item) => item[iteratee];
  const seen = new Set();
  const result = [];
  arr.forEach((item, index) => {
    const key = fn(item, index, arr);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(item);
  });
  return result;
}

/**
 * 延伸 2：自定义相等规则 uniqueWith
 *
 * 需求：调用方传 comparator(a, b)，长得一样但引用不同的对象也能去重。
 *
 * 思路：每个新元素和结果中的已有元素逐个比较，都不相等才保留。
 * 这是 O(n²)，数据量大时应尽量抽出稳定 key 改用 uniqueBy。
 *
 * ——— 示例 ———
 * 输入：uniqueWith([{x:1}, {x:1}], (a,b) => a.x === b.x)
 * 输出：[{x:1}]
 */
function uniqueWith(arr, comparator) {
  const result = [];
  for (const item of arr) {
    if (!result.some((saved) => comparator(saved, item))) result.push(item);
  }
  return result;
}

// —— 自测 ——
console.log(unique([1, 1, 2, 3, 3, 3, 4])); // [1, 2, 3, 4]
console.log(unique(['a', 'b', 'a', 'c']));  // ['a', 'b', 'c']

module.exports = { unique, uniqueBy, uniqueWith };
