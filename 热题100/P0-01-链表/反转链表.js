/**
 * 反转链表（LeetCode 206）
 *
 * 给定单链表的头节点 head，反转链表，返回反转后的头节点。
 *
 * 思路：
 * 1. 每个 next 改指前一个节点，原头变尾。
 * 2. 递归先翻后面，再让后继指回自己。迭代用 prev / curr 逐个改指针。
 * 3. 空链表或单节点直接返回。递归必须切断 head.next，否则成环。
 * 复杂度：时间 O(n)，空间 递归 O(n) / 迭代 O(1)
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
  head.next.next = head; // 后继指回来
  head.next = null;      // 切断原指向，否则成环

  return newHead;
}

/**
 * 迭代法（双指针）
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseListIterative(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
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

// —— 迭代版自测 ——
console.log(toArray(reverseListIterative(build([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(toArray(reverseListIterative(build([1, 2]))));          // [2, 1]
console.log(toArray(reverseListIterative(build([]))));              // []

module.exports = { ListNode, reverseList, reverseListIterative, build, toArray };
