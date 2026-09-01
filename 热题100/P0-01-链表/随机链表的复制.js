/**
 * 热题 100 · 随机链表的复制
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 随机链表的复制（LeetCode 138）
 *
 * 给定一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random，
 * 该指针可以指向链表中的任何节点或空节点。
 * 请构造这个链表的深拷贝。深拷贝应该正好由 n 个全新节点组成，
 * 其中每个新节点的值都设为其对应原节点的值。新节点的 next 和 random
 * 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针
 * 能够表示相同的链表状态。复制链表中的指针都不应指向原链表中的节点。
 *
 * 每个节点用 [val, random_index] 表示，random_index 为 random 指向节点的下标
 * （从 0 开始），若不指向任何节点则为 null。
 *
 * 思路：
 * 1. 深拷贝带 random 指针的链表。
 * 2. 三步：原节点后穿插拷贝、按原 random 接拷贝的 random、把拷贝拆出来。
 * 3. 空链表返回 null。拆的时候要把原链表 next 复原。
 * 复杂度：时间 O(n)，空间 O(1) 不计新链表
 *
 * ——— 示例 ———
 * 输入： head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
 * 输出： [[7,null],[13,0],[11,4],[10,2],[1,0]]
 *
 * 输入： head = [[1,1],[2,1]]
 * 输出： [[1,1],[2,1]]
 *
 * ——— 延伸 ———
 * - 哈希：先扫一遍建 old -> new，再扫一遍接 next / random。空间 O(n)，好写。
 * - 本题穿插法省掉哈希，面试常要这版。
 * - 图的深拷贝（LC133）同一套路：map 记「原节点 -> 拷贝」。
 *
 * ——— 常见追问 ———
 * Q: 为什么先穿插再接 random？
 * A: 拷贝就在原节点后面，orig.random.next 就是拷贝的 random。不用哈希也能点到。
 *
 * Q: 拆的时候为什么要复原原链表？
 * A: 题目没说能改原链表。p.next = cur.next 把原节点接回原来的下一个。
 *
 * Q: random 是 null？
 * A: if (p.random) 挡一下，拷贝的 random 保持 null。
 *
 * Q: 空间真 O(1)？
 * A: 不计新链表的话只用几个指针。哈希版额外 O(n)。
 */

// —— 带 random 的节点定义 ——
function Node(val, next, random) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

/**
 * @param {Node} head
 * @return {Node}
 */
function copyRandomList(head) {
  if (!head) return null;
  // 1. A -> A' -> B -> B'
  for (let p = head; p; p = p.next.next) {
    p.next = new Node(p.val, p.next, null);
  }
  // 2. copy.random = orig.random 的后一个（拷贝）
  for (let p = head; p; p = p.next.next) {
    if (p.random) p.next.random = p.random.next; // 原 random 后面就是它的拷贝
  }
  // 3. 拆开，原链表 next 复原
  const dummy = new Node(0);
  let cur = dummy;
  let p = head;
  while (p) {
    cur.next = p.next;
    cur = cur.next;
    p.next = cur.next; // 原节点跳过拷贝，接回原来的下一个
    p = p.next;
  }
  return dummy.next;
}

/**
 * 延伸 1：哈希映射版
 *
 * 需求：用最直观的两遍扫描完成深拷贝，原链表保持不变。
 *
 * 思路：第一遍建立“原节点 → 新节点”；第二遍通过 Map 接好 next 和 random。
 *
 * ——— 示例 ———
 * 示例：[[7,null],[13,0]] 拷贝后序列相同，但所有节点引用都不同。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function copyRandomListWithMap(head) {
  if (!head) return null;
  const copies = new Map();
  for (let node = head; node; node = node.next) copies.set(node, new Node(node.val));
  for (let node = head; node; node = node.next) {
    copies.get(node).next = copies.get(node.next) || null;
    copies.get(node).random = copies.get(node.random) || null;
  }
  return copies.get(head);
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

// —— 自测 ——
console.log(serialize(copyRandomList(buildRandomList([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]))));
// 期望： [[7,null],[13,0],[11,4],[10,2],[1,0]]
console.log(serialize(copyRandomList(buildRandomList([[1, 1], [2, 1]]))));
// 期望： [[1,1],[2,1]]

module.exports = { Node, copyRandomList, copyRandomListWithMap, buildRandomList, serialize };
