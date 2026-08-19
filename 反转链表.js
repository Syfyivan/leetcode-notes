/**
 * 反转链表（LeetCode 206）
 *
 * 给定单链表的头节点 head，反转链表，返回反转后的头节点。
 *
 * ——— 示例 ———
 * 输入： 1 -> 2 -> 3 -> 4 -> 5
 * 输出： 5 -> 4 -> 3 -> 2 -> 1
 *
 * 输入： 1 -> 2
 * 输出： 2 -> 1
 *
 * 输入： 空链表（null）
 * 输出： 空链表（null）
 *
 * 迭代、递归都可以，自己挑一种先写，写完再换另一种。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  if(!head || !head.next) return head;

  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
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
console.log(toArray(reverseList(build([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(toArray(reverseList(build([1, 2]))));          // [2, 1]
console.log(toArray(reverseList(build([]))));              // []

module.exports = { ListNode, reverseList, build, toArray };
