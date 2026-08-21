/**
 * 扁平数组 → 树
 *
 * 优先级：前端 P0 · 全栈 P1
 *
 * 输入：每项形如 { id, parentId, name }，根节点 parentId 为 null。
 * 输出：带 children 字段的嵌套树（可能有多棵，返回森林 / 根数组）。
 *
 * ——— 示例 ———
 * 输入（扁平数组，每个节点靠 parentId 记住"我上级是谁"）：
 *   [
 *     { id: 1, parentId: null, name: '总部' },
 *     { id: 2, parentId: 1,    name: '技术部' },
 *     { id: 4, parentId: 2,    name: '前端组' },
 *   ]
 *
 * 输出（嵌套树，用 children 数组把下级装进上级里）：
 *   [
 *     {
 *       id: 1, parentId: null, name: '总部',
 *       children: [
 *         {
 *           id: 2, parentId: 1, name: '技术部',
 *           children: [
 *             { id: 4, parentId: 2, name: '前端组', children: [] }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 *
 * 注意：返回的是"根节点数组"。为什么是数组而不是单个对象？
 * 因为可能有多个 parentId 为 null 的节点（多棵树 = 森林），所以统一用数组装。
 */

// —— 测试数据 ——
const flatList = [
  { id: 1, parentId: null, name: '总部' },
  { id: 2, parentId: 1, name: '技术部' },
  { id: 3, parentId: 1, name: '产品部' },
  { id: 4, parentId: 2, name: '前端组' },
  { id: 5, parentId: 2, name: '后端组' },
  { id: 6, parentId: 4, name: 'React 小组' },
  { id: 7, parentId: 3, name: '设计组' },
];

/**
 * @param {{id:number, parentId:number|null, name:string}[]} list
 * @return {object[]} 根节点数组（森林）
 */
function listToTree(list) {
    const map = new Map();
    const roots = [];

    for(const item of list) {
      map.set(item.id, {...item, children: []});
    }
    for(const item of list) {
      const node = map.get(item.id);
      if(item.parentId === null) {
        roots.push(node);
      } else {
        const parent = map.get(item.parentId);
        parent.children.push(node)
      }
    }
    return roots;
}

// —— 自测 ——
console.log(JSON.stringify(listToTree(flatList), null, 2));

module.exports = { listToTree, flatList };
