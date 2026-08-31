/**
 * 扁平数组 → 树
 *
 * 优先级：前端 P0 · 全栈 P1
 *
 * 输入：每项形如 { id, parentId, name }，根节点 parentId 为 null。
 * 输出：带 children 字段的嵌套树（可能有多棵，返回森林 / 根数组）。
 *
 * 思路：
 * 1. 先一遍建 Map，id 指向带 children 的节点。
 * 2. 再一遍：parentId 为 null 进 roots，否则推进父节点的 children。
 * 3. 两遍是为了父节点后出现也能挂上。spread 复制，不改原数组。
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
 *
 * ——— 常见追问 ———
 * Q: 为什么必须两遍？
 * A: 父可能排在子后面。一遍扫到孩子时父还不在 Map 里。先建完再挂。
 *
 * Q: 为什么 spread 复制？
 * A: 直接改 item.children 会污染原数组。面试常要求纯函数。
 *
 * Q: parent 不存在会怎样？
 * A: `parent.children` 读 undefined，直接抛。可以说丢进 roots，或跳过。
 *
 * Q: 为什么用 === null 判断根？
 * A: parentId 为 0 时，!parentId 为 true，会误判成根。0 是合法 id。
 *
 * Q: Map 和普通对象当字典差在哪？
 * A: 对象会把数字 key 转成字符串。Map 原样存，查找不用操心类型。
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
      map.set(item.id, {...item, children: []}); // spread 出新对象；先建完所有节点，第二遍随便挂
    }
    for(const item of list) {
      const node = map.get(item.id);
      if(item.parentId === null) { // 0 是合法 id，!parentId 会把 0 当成根
        roots.push(node);
      } else {
        const parent = map.get(item.parentId);
        parent.children.push(node)
      }
    }
    return roots;
}

/**
 * 延伸 1：处理孤儿、重复 id 和同层排序
 *
 * 需求：真实数据可能缺父节点或出现重复 id。用 options 明确处理策略：
 *   - orphan: 'root' 把孤儿当根，'discard' 丢掉，'throw' 直接报错；
 *   - compare: 传入比较函数后，所有同层节点都按它排序；
 *   - 重复 id 一律报错，避免后写节点悄悄覆盖前一个。
 *
 * 思路：
 * 1. 第一遍建 Map 时校验重复 id。
 * 2. 第二遍挂载时按 orphan 策略处理找不到父节点的项。
 * 3. 挂完后递归排序，保证 roots 和每个 children 都走同一规则。
 *
 * ——— 示例 ———
 * 输入：listToTreeWithOptions([{ id: 2, parentId: 99 }], { orphan: 'root' })
 * 输出：id=2 的节点作为根节点返回
 */
function listToTreeWithOptions(list, options = {}) {
  const { orphan = 'throw', compare } = options;
  if (!['root', 'discard', 'throw'].includes(orphan)) {
    throw new TypeError('orphan 只能是 root、discard 或 throw');
  }

  const map = new Map();
  const roots = [];
  for (const item of list) {
    if (map.has(item.id)) throw new Error(`重复 id: ${item.id}`);
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of list) {
    const node = map.get(item.id);
    if (item.parentId === null) {
      roots.push(node);
      continue;
    }
    const parent = map.get(item.parentId);
    if (parent) {
      parent.children.push(node);
    } else if (orphan === 'root') {
      roots.push(node);
    } else if (orphan === 'throw') {
      throw new Error(`节点 ${item.id} 的父节点 ${item.parentId} 不存在`);
    }
  }

  if (typeof compare === 'function') {
    const sortLevel = (nodes) => {
      nodes.sort(compare);
      nodes.forEach((node) => sortLevel(node.children));
    };
    sortLevel(roots);
  }
  return roots;
}

/**
 * 延伸 2：一遍扫描占位法
 *
 * 需求：父节点晚于子节点出现时仍能一次扫描完成挂载。
 *
 * 思路：
 * 1. 每个 id 在 Map 中都对应一个稳定对象引用。
 * 2. 孩子先出现时，先给父 id 建只有 children 的占位对象并挂上孩子。
 * 3. 父节点后来出现，再用 Object.assign 补齐同一个占位对象，孩子引用不会丢。
 *
 * ——— 示例 ———
 * 输入：[{ id: 2, parentId: 1 }, { id: 1, parentId: null }]
 * 输出：id=2 正确挂在 id=1 的 children 中
 */
function listToTreeOnePass(list) {
  const map = new Map();
  const roots = [];
  const getNode = (id) => {
    if (!map.has(id)) map.set(id, { children: [] });
    return map.get(id);
  };

  for (const item of list) {
    const node = getNode(item.id);
    Object.assign(node, item);
    if (item.parentId === null) {
      roots.push(node);
    } else {
      getNode(item.parentId).children.push(node);
    }
  }
  return roots;
}

// —— 自测 ——
console.log(JSON.stringify(listToTree(flatList), null, 2));

module.exports = {
  listToTree,
  listToTreeWithOptions,
  listToTreeOnePass,
  flatList,
};
