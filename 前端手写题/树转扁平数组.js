/**
 * 树 → 扁平数组（listToTree 的逆操作）
 *
 * 输入：带 children 字段的嵌套树（根数组 / 森林）。
 * 输出：扁平数组，每项保留 { id, parentId, name }，去掉 children。
 *
 * ——— 示例 ———
 * 输入（嵌套树，下级装在上级的 children 里）：
 *   [
 *     {
 *       id: 1, parentId: null, name: '总部',
 *       children: [
 *         { id: 2, parentId: 1, name: '技术部', children: [
 *           { id: 4, parentId: 2, name: '前端组', children: [] }
 *         ] }
 *       ]
 *     }
 *   ]
 *
 * 输出（拍平成一维，去掉 children，每个节点靠 parentId 记住上级）：
 *   [
 *     { id: 1, parentId: null, name: '总部' },
 *     { id: 2, parentId: 1,    name: '技术部' },
 *     { id: 4, parentId: 2,    name: '前端组' },
 *   ]
 *
 * 注意：数组里节点的先后顺序取决于你怎么遍历（深度优先 / 逐层），
 * 只要"父节点在前、且 parentId 关系正确"即可，顺序本身不唯一。
 */

// —— 测试数据 ——
const tree = [
  {
    id: 1, parentId: null, name: '总部',
    children: [
      {
        id: 2, parentId: 1, name: '技术部',
        children: [
          { id: 4, parentId: 2, name: '前端组', children: [
            { id: 6, parentId: 4, name: 'React 小组', children: [] },
          ] },
          { id: 5, parentId: 2, name: '后端组', children: [] },
        ],
      },
      {
        id: 3, parentId: 1, name: '产品部',
        children: [
          { id: 7, parentId: 3, name: '设计组', children: [] },
        ],
      },
    ],
  },
];

/**
 * @param {object[]} nodes 根节点数组（森林）
 * @return {{id:number, parentId:number|null, name:string}[]}
 */


function treeToList(nodes) {
  const res = [];
 
  function handleNode(node) {
    const {children, ...reset} = node;
    res.push(reset);
    
    for(const item of node.children) {
      handleNode(item);
    }
  }
   for(const item of nodes) {
      handleNode(item);
   }
   return res;
}

// —— 自测 ——
console.log(JSON.stringify(treeToList(tree), null, 2));

module.exports = { treeToList, tree };
