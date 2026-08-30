/**
 * K 个一组翻转链表（LeetCode 25）
 *
 * 给定链表的头节点 head，每 k 个节点一组翻转，返回翻转后的链表。
 * k 是正整数，且小于或等于链表长度。
 * 如果节点总数不是 k 的整数倍，最后剩下的不足 k 个的节点保持原有顺序。
 *
 * 进阶：只能用常数额外空间。
 *
 * 思路：
 * 1. 每 k 个节点翻一段，不够 k 个保持原样。
 * 2. 虚拟头。每次先数 k 个，够就翻转这一段，前驱接到新头。
 * 3. k=1 或空链表直接返回。翻转后原头变成尾，下一组从它后面接。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： 1 -> 2 -> 3 -> 4 -> 5,  k = 2
 * 输出： 2 -> 1 -> 4 -> 3 -> 5
 *
 * 输入： 1 -> 2 -> 3 -> 4 -> 5,  k = 3
 * 输出： 3 -> 2 -> 1 -> 4 -> 5
 *
 * 输入： 1 -> 2 -> 3 -> 4 -> 5,  k = 1
 * 输出： 1 -> 2 -> 3 -> 4 -> 5
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (true) {
    let tail = prev;
    for (let i = 0; i < k; i++) {
      tail = tail.next;
      if (!tail) return dummy.next; // 不够 k 个，不翻
    }
    const next = tail.next;
    let curr = prev.next;
    let p = next;
    while (curr !== next) {
      const nxt = curr.next;
      curr.next = p;
      p = curr;
      curr = nxt;
    }
    const newTail = prev.next; // 原头变尾
    prev.next = tail;
    prev = newTail;
  }
}

// —— 小工具：数组建链表 / 链表转数组，方便自测 ——
function build(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}
function toArray(head) {
  const res = [];
  for (let p = head; p; p = p.next) res.push(p.val);
  return res;
}

// —— 自测 ——
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 2))); // [2, 1, 4, 3, 5]
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 3))); // [3, 2, 1, 4, 5]
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 1))); // [1, 2, 3, 4, 5]

module.exports = { ListNode, reverseKGroup, build, toArray };
