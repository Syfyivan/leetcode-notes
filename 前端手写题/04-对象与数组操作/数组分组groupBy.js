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
 * ——— 示例 ———
 * 输入： groupBy([6.1, 4.2, 6.3], Math.floor)
 * 输出： { '4': [4.2], '6': [6.1, 6.3] }
 *
 * 输入： groupBy([{ t: 'a' }, { t: 'b' }, { t: 'a' }], 't')
 * 输出： { a: [{t:'a'}, {t:'a'}], b: [{t:'b'}] }
 */

function groupBy() {
}

// —— 自测 ——
console.log(groupBy([6.1, 4.2, 6.3], Math.floor));
// { '4': [4.2], '6': [6.1, 6.3] }
console.log(groupBy([{ t: 'a' }, { t: 'b' }, { t: 'a' }], 't'));
// { a: [{t:'a'}, {t:'a'}], b: [{t:'b'}] }

module.exports = { groupBy };
