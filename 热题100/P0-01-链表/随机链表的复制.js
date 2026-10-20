/**
 * 热题 100 · 随机链表的复制
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 随机链表的复制（LeetCode 138 · 中等）
 *
 * 【题目描述】
 * 给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。
 * 构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应原节点的值。
 * 新节点的 next 和 random 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。
 * 复制链表中的指针都不应指向原链表中的节点 。
 *
 * 进阶：你能否不使用额外的哈希表，实现 O(1) 辅助空间的算法？
 *
 * ——— 解法一：节点穿插交织法（原地三步法，推荐，O(1) 空间） ———
 *
 * 【核心思维模型】
 * 复制带 random 指针链表的核心难点在于：当创建新节点 A' 时，A 的 random 指针所指向的节点可能尚未被创建，无法建立映射。
 * 穿插法通过将每个克隆节点直接插入在原节点之后，巧妙利用物理相邻关系实现了 O(1) 的原节点与新节点映射！
 *
 * 1. 第一步：复制每个节点，并穿插在其原节点之后
 *    原始：A ──────────> B ──────────> C
 *    穿插：A ──> A' ──> B ──> B' ──> C ──> C'
 *    代码：
 *      const copy = new Node(p.val, p.next, null);
 *      p.next = copy;
 *
 * 2. 第二步：构建克隆节点的 random 指向
 *    若原节点 p 的 random 指向 nodeR，则 p 的克隆节点 (p.next) 的 random 必然指向 nodeR 的克隆节点 (nodeR.next)！
 *    即：`copy.random = orig.random.next`。
 *    代码：
 *      if (p.random) p.next.random = p.random.next;
 *
 * 3. 第三步：拆分分离两条链表（原链表必须完全复原）
 *    将穿插在一起的交织链表拆分为原链表和克隆链表两串独立链表。
 *    原链表：A ──> B ──> C
 *    新链表：A' ──> B' ──> C'
 *
 * ——— 解法二：哈希表映射法（直观，空间 O(n)） ———
 * 1. 第一遍遍历：建立 Map<Node, Node>，根据原节点 new 出同值的克隆节点。
 * 2. 第二遍遍历：通过 Map 映射接好 `map.get(node).next` 与 `map.get(node).random`。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(n)，三步穿插法共遍历链表 3 遍，总时间 3n = O(n)。
 * 空间复杂度：
 *   - 解法一（穿插法）：O(1) 额外空间（不计存放结果链表本身）。
 *   - 解法二（哈希法）：O(n)，Map 需存储 n 个映射项。
 */

// —— 带 random 的节点定义 ——
function Node(val, next, random) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

/**
 * 节点穿插交织法（O(1) 额外空间）
 * @param {Node} head
 * @return {Node|null}
 */
function copyRandomList(head) {
  if (!head) return null;

  // 第一步：克隆节点并插入原节点后方 (A -> A' -> B -> B')
  for (let p = head; p; p = p.next.next) {
    p.next = new Node(p.val, p.next, null);
  }

  // 第二步：连接克隆节点的 random 指针
  for (let p = head; p; p = p.next.next) {
    if (p.random) {
      p.next.random = p.random.next; // 原 random 节点的下一个就是克隆 random
    }
  }

  // 第三步：拆分两条链表，并恢复原链表
  const dummy = new Node(0);
  let cur = dummy;
  let p = head;

  while (p) {
    const copy = p.next;
    cur.next = copy;      // 接入克隆链表
    cur = cur.next;

    p.next = copy.next;   // 原节点跳过克隆体，接回原下一个节点（复原原链表）
    p = p.next;
  }

  return dummy.next;
}

/**
 * 延伸 1：哈希表映射法
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 *
 * @param {Node} head
 * @return {Node|null}
 */
function copyRandomListWithMap(head) {
  if (!head) return null;

  const map = new Map();

  // 第一遍：创建所有新节点
  for (let node = head; node; node = node.next) {
    map.set(node, new Node(node.val));
  }

  // 第二遍：连接 next 和 random
  for (let node = head; node; node = node.next) {
    const copyNode = map.get(node);
    copyNode.next = map.get(node.next) || null;
    copyNode.random = map.get(node.random) || null;
  }

  return map.get(head);
}

// —— 小工具：由 [val, randomIndex] 数组构造带 random 的链表 ——
function buildRandomList(arr) {
  const nodes = arr.map(([v]) => new Node(v));
  for (let i = 0; i < arr.length; i++) {
    if (i + 1 < arr.length) nodes[i].next = nodes[i + 1];
    const ri = arr[i][1];
    nodes[i].random = ri === null ? null : nodes[ri];
  }
  return nodes[0] || null;
}
// —— 小工具：把链表序列化回 [val, randomIndex] 数组，便于自测比对 ——
function serialize(head) {
  const list = [];
  const indexOf = new Map();
  for (let p = head, i = 0; p; p = p.next, i++) { indexOf.set(p, i); list.push(p); }
  return list.map((n) => [n.val, n.random === null ? null : indexOf.get(n.random)]);
}

/**
 * ——— 常见面试追问 ———
 * Q1: 拆分链表时为什么要严格把原链表的 next 复原？
 * A1: 在工程规范中，只读/拷贝性质的函数不应该产生外部不可预期的副作用（Side Effect）。如果破坏了传入的原链表结构，调用方后续使用原链表会出现异常。
 *
 * Q2: 为什么 `p.next.random = p.random.next` 就能准确找到克隆节点？
 * A2: 因为在第一步完成后，每一个原节点的克隆体都精确紧贴在其正后方（`p.next`）。因此 `p.random` 这个原节点对应的克隆体，也必然紧贴在 `p.random.next` 上。
 */

// —— 自测 ——
console.log(serialize(copyRandomList(buildRandomList([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]))));
// 期望： [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]

console.log(serialize(copyRandomList(buildRandomList([[1, 1], [2, 1]]))));
// 期望： [[1, 1], [2, 1]]

// —— 哈希版自测 ——
console.log(serialize(copyRandomListWithMap(buildRandomList([[1, 1], [2, 1]]))));
// 期望： [[1, 1], [2, 1]]

module.exports = { Node, copyRandomList, copyRandomListWithMap, buildRandomList, serialize };
