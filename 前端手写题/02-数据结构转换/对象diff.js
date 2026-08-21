/**
 * 对象 diff —— 找出两个对象所有值不同的字段路径
 *
 * 优先级：前端 P0 · 全栈 P2
 *
 * 输入：新对象 newObj、旧对象 oldObj（可能多层嵌套）。
 * 输出：一个字符串数组，列出所有"值发生变化"的字段路径。
 *       嵌套用点连接，例如 'a.b.c'。
 * 规则：
 *   - 深层的纯对象要递归进去比，只报到"真正变化的那一层叶子路径"。
 *   - 新增的 key、删除的 key 也算变化（两边 key 要合并起来一起看）。
 *   - 基本类型 / 其中一边不是对象时，直接比值（!==）。
 *
 * ——— 示例 ———
 * 输入：
 *   newObj = { a: 1, b: { c: 2, d: 3 }, e: 5 }
 *   oldObj = { a: 1, b: { c: 9 },       f: 6 }
 *
 * 输出（顺序不唯一）：
 *   [
 *     'b.c',   // 2 !== 9
 *     'b.d',   // 新增
 *     'e',     // 新增
 *     'f',     // 删除
 *   ]
 */

/**
 * @param {object} newObj
 * @param {object} oldObj
 * @return {string[]} 所有发生变化的字段路径
 */
function isObj(x) {
  return typeof x === 'object' && x !== null;
}

function diff(newObj, oldObj, prefix = '') {
  const res = [];
   const keys = new Set([...Object.keys(newObj), ...Object.keys(oldObj)]);

   for(const key of keys) {
    const newItem = newObj[key];
    const oldItem = oldObj[key];
    const path = prefix ? prefix + '.' + key : key 

    if(isObj(newItem) && isObj(oldItem)) {
      res.push(...diff(newItem, oldItem, path))
    } else {
      if(newItem !== oldItem) res.push(path);
    }
   }
   return res;
}

// —— 自测 ——
const newObj = { a: 1, b: { c: 2, d: 3 }, e: 5 };
const oldObj = { a: 1, b: { c: 9 }, f: 6 };
console.log(diff(newObj, oldObj)); // ['b.c', 'b.d', 'e', 'f'] （顺序不唯一）

module.exports = { diff };
