/**
 * 相交链表（LeetCode 160）
 *
 * 给定两个单链表的头节点 headA 和 headB，找出并返回两个链表相交的起始节点。
 * 如果两个链表没有交点，返回 null。
 *
 * “相交”指的是两个链表从某个节点开始，之后的节点完全共享（是同一批节点对象），
 * 不是节点值相等而已。相交后不会再分开。
 *
 * ——— 示例 ———
 * 输入： listA = 4 -> 1 -> 8 -> 4 -> 5
 *        listB = 5 -> 6 -> 1 -> 8 -> 4 -> 5
 *        其中 8 -> 4 -> 5 是两个链表共享的同一批节点
 * 输出： 相交起始节点（值为 8 的那个节点）
 *
 * 输入： listA = 2 -> 6 -> 4,  listB = 1 -> 5，两者无公共节点
 * 输出： null
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
function getIntersectionNode(headA, headB) {
  // TODO
}

// —— 小工具：build 建普通链表；makeIntersect 造出真正共享尾部的两条链表 ——
function build(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}
// onlyA、onlyB 为各自独有的前缀值数组，common 为共享尾部的值数组
function makeIntersect(onlyA, onlyB, common) {
  const shared = build(common);
  const linkTo = (arr) => {
    if (arr.length === 0) return shared;
    const head = build(arr);
    let p = head;
    while (p.next) p = p.next;
    p.next = shared;
    return head;
  };
  return [linkTo(onlyA), linkTo(onlyB), shared];
}

// —— 自测 ——
const [a1, b1, cross] = makeIntersect([4, 1], [5, 6, 1], [8, 4, 5]);
console.log(getIntersectionNode(a1, b1) === cross); // true（返回值为 8 的那个共享节点）

const a2 = build([2, 6, 4]);
const b2 = build([1, 5]);
console.log(getIntersectionNode(a2, b2)); // null

module.exports = { ListNode, getIntersectionNode, build, makeIntersect };
