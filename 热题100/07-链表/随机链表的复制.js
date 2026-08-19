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
 * ——— 示例 ———
 * 输入： head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
 * 输出： [[7,null],[13,0],[11,4],[10,2],[1,0]]
 *
 * 输入： head = [[1,1],[2,1]]
 * 输出： [[1,1],[2,1]]
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
  // TODO
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

module.exports = { Node, copyRandomList, buildRandomList, serialize };
