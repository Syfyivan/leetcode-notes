/**
 * 树 → 扁平数组（listToTree 的逆操作）
 *
 * 优先级：前端 P0 · 全栈 P1
 *
 * 输入：带 children 字段的嵌套树（根数组 / 森林）。
 * 输出：扁平数组，每项保留 { id, parentId, name }，去掉 children。
 *
 * 思路：
 * 1. DFS 先推当前节点，再走 children。
 * 2. 解构丢掉 children，留下 id / parentId / name。
 * 3. 父节点一定在子节点前面。
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
 *
 * ——— 常见追问 ———
 * Q: 为什么先 push 再走 children？
 * A: 前序。父一定排在子前面。后序的话，回头挂树会找不到父。
 *
 * Q: 顺序必须和原来的扁平数组一样吗？
 * A: 不必须。DFS / BFS 顺序不同，parentId 对、父在子前，就能再转回去。
 *
 * Q: 解构为什么丢掉 children？
 * A: 带着 children 还是树。扁平项只要 id / parentId / name。
 *
 * Q: children 是 undefined 会怎样？
 * A: `for...of undefined` 会抛。入口写成 `node.children || []` 更稳。
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
    const {children, ...reset} = node; // 丢掉 children，扁平项不再嵌套
    res.push(reset);
    
    for(const item of node.children) {
      handleNode(item); // 先推自己再下钻，父才会排在子前面
    }
  }
   for(const item of nodes) {
      handleNode(item);
   }
   return res;
}

/**
 * 延伸 1：BFS 逐层拍平
 *
 * 需求：输出顺序按层级排列，同一层的节点连续出现。
 * 典型场景：分层统计、按层渲染，或希望先拿到所有浅层节点。
 *
 * 思路：
 * 1. 根节点先全部入队。
 * 2. 每次出队一个节点，去掉 children 后写入结果，再把孩子放到队尾。
 * 3. 用 head 下标代替 shift，避免每次移动整个数组。
 *
 * ——— 示例 ———
 * 输入：1 的孩子为 2、3，2 的孩子为 4
 * 输出顺序：1、2、3、4
 */
function treeToListBFS(nodes) {
  const result = [];
  const queue = [...nodes];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    const { children = [], ...rest } = node;
    result.push(rest);
    queue.push(...children);
  }
  return result;
}

/**
 * 延伸 2：现场生成 parentId 和 depth
 *
 * 需求：源树不要求自带 parentId。遍历时根据上下级关系补出 parentId，
 *       再额外写入 depth，方便表格缩进和层级筛选。
 *
 * 思路：DFS 参数携带父 id 和当前深度；根的 parentId 统一用 null。
 *
 * ——— 示例 ———
 * 输入：[{ id: 1, children: [{ id: 2 }] }]
 * 输出：[{ id: 1, parentId: null, depth: 0 }, { id: 2, parentId: 1, depth: 1 }]
 */
function treeToListWithMeta(nodes) {
  const result = [];

  function visit(node, parentId, depth) {
    const { children = [], parentId: ignoredParentId, depth: ignoredDepth, ...rest } = node;
    result.push({ ...rest, parentId, depth });
    children.forEach((child) => visit(child, node.id, depth + 1));
  }

  nodes.forEach((node) => visit(node, null, 0));
  return result;
}

// —— 自测 ——
console.log(JSON.stringify(treeToList(tree), null, 2));

module.exports = { treeToList, treeToListBFS, treeToListWithMeta, tree };
