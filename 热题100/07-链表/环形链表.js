/**
 * 环形链表（LeetCode 141）
 *
 * 给定链表的头节点 head，判断链表中是否有环。
 * 如果链表中某个节点可以通过不断跟随 next 指针再次到达，则链表中存在环。
 * 存在环返回 true，否则返回 false。
 *
 * 注意：不要用改节点值 / 加标记的取巧办法，正经判环。
 *
 * ——— 示例 ———
 * 输入： 3 -> 2 -> 0 -> -4，且 -4 的 next 指回节点 2（成环）
 * 输出： true
 *
 * 输入： 1 -> 2，且 2 的 next 指回节点 1（成环）
 * 输出： true
 *
 * 输入： 1（单节点，无环）
 * 输出： false
 *
 * 输入： 空链表（null）
 * 输出： false
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
}

// —— 小工具：建链表，并可选地让尾节点指向第 pos 个节点（0 起）制造环；pos = -1 表示无环 ——
function buildWithCycle(arr, pos) {
  const nodes = arr.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0] || null;
}

// —— 自测 ——
console.log(hasCycle(buildWithCycle([3, 2, 0, -4], 1))); // true
console.log(hasCycle(buildWithCycle([1, 2], 0)));        // true
console.log(hasCycle(buildWithCycle([1], -1)));          // false
console.log(hasCycle(buildWithCycle([], -1)));           // false

module.exports = { ListNode, hasCycle, buildWithCycle };
