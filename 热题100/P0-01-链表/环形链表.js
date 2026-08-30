/**
 * 环形链表（LeetCode 141）
 *
 * 给定链表的头节点 head，判断链表中是否有环。
 * 如果链表中某个节点可以通过不断跟随 next 指针再次到达，则链表中存在环。
 * 存在环返回 true，否则返回 false。
 *
 * 注意：不要用改节点值 / 加标记的取巧办法，正经判环。
 *
 * 思路：
 * 1. 判断链表有没有环。
 * 2. Floyd 快慢指针：慢走 1、快走 2，能相遇就有环。
 * 3. 空链表或单节点无环。快走前先看 fast.next，避免空引用。
 * 复杂度：时间 O(n)，空间 O(1)
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
 *
 * ——— 延伸 ———
 * - 环形链表 II：相遇后再把一个指针放回头，同步走，第二次相遇是入口。
 * - 哈希记下见过的节点，再遇到就是环。空间 O(n)，好写。
 * - 找环长度：相遇后让 fast 再走一圈回到 slow，计步数。
 *
 * ——— 常见追问 ———
 * Q: 为什么快走 2 慢走 1 一定相遇？
 * A: 有环时快的会在环里套圈。相对速度 1，每轮靠近一格，必碰上。
 *
 * Q: 快走 3 行不行？
 * A: 可能永远错开，不保证相遇。2 最稳。
 *
 * Q: while 为什么看 fast && fast.next？
 * A: 要迈两步。fast 或 fast.next 空说明到尾巴了，无环。
 *
 * Q: 单节点自环？
 * A: slow 走一步、fast 走两步都回到自己，相遇，true。
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
  let slow = head;
  let fast = head;
  while (fast && fast.next) { // 迈两步前确认 fast.next 还在
    slow = slow.next;
    fast = fast.next.next; // 快走 2 步
    if (slow === fast) return true; // 碰上就是有环
  }
  return false;
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
