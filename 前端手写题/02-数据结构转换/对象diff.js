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
 * 思路：
 * 1. 两边的 key 并到一个 Set 里，新增、删除都能扫到。
 * 2. 两边都是对象就带着前缀递归，只报叶子路径。
 * 3. 一边不是对象就 !== 比较。嵌套路径用点拼。
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
 *
 * ——— 延伸 ———
 * - 数组：按 '0' '1' 当下标递归。有的题把数组当叶子，一变就报整条路径。
 * - 循环引用：WeakMap 记下走过的对象对，见过就跳，不然会死循环。
 * - 返回 { added, removed, changed } 比光路径更像真实 diff。
 *
 * ——— 常见追问 ———
 * Q: 为什么两边 key 要并到一个 Set？
 * A: 只扫新对象会漏删除。只扫旧对象会漏新增。Set 去重，两边一次扫完。
 *
 * Q: 两边都是对象才递归，一边是数字怎么办？
 * A: 结构已经变了，再往下比没有意义。整条路径直接算变化，停在这一层。
 *
 * Q: `{a:{b:1}}` 和 `{a:1}` 为什么报 `a` 不报 `a.b`？
 * A: 一边已经是数字，走 !== 分支，路径停在 `a`。只报到真正变化的那一层。
 *
 * Q: NaN !== NaN 会误报吗？
 * A: 会。Object.is 能把 NaN 当相等。基础题一般不卡。
 *
 * Q: Date、数组怎么处理？
 * A: 这份把它们当普通对象。Date 没有可枚举字段，看起来没变。
 *    数组按 '0' '1' 递归。要整体替换就加 Array.isArray，整段当叶子。
 */

/**
 * @param {object} newObj
 * @param {object} oldObj
 * @return {string[]} 所有发生变化的字段路径
 */
function isObj(x) {
  return typeof x === 'object' && x !== null; // typeof null === 'object'，不挡会递归进去
}

function diff(newObj, oldObj, prefix = '') {
  const res = [];
   const keys = new Set([...Object.keys(newObj), ...Object.keys(oldObj)]); // 两边并起来，删掉的字段也能扫到

   for(const key of keys) {
    const newItem = newObj[key];
    const oldItem = oldObj[key];
    const path = prefix ? prefix + '.' + key : key 

    if(isObj(newItem) && isObj(oldItem)) {
      res.push(...diff(newItem, oldItem, path))
    } else if(newItem !== oldItem) {
      res.push(path); // 新增 / 删除 / 叶子值变了，都落在这一支
    }
   }
   return res;
}

// —— 自测 ——
const newObj = { a: 1, b: { c: 2, d: 3 }, e: 5 };
const oldObj = { a: 1, b: { c: 9 }, f: 6 };
console.log(diff(newObj, oldObj)); // ['b.c', 'b.d', 'e', 'f'] （顺序不唯一）

module.exports = { diff };
