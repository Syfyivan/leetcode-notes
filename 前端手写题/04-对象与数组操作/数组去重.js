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
 * ——— 延伸 ———
 * - 对象去重：Map + JSON.stringify 当 key，或 iteratee 抽 id。Set 只认引用。
 * - filter + indexOf 也能做，NaN 对不上（indexOf 用 ===）。
 * - 按字段去重用 lodash.uniqBy，iteratee 返回值当唯一键。
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

// —— 自测 ——
console.log(unique([1, 1, 2, 3, 3, 3, 4])); // [1, 2, 3, 4]
console.log(unique(['a', 'b', 'a', 'c']));  // ['a', 'b', 'c']

module.exports = { unique };
