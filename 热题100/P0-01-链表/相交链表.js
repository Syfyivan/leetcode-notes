/**
 * 相交链表（LeetCode 160）
 *
 * 给定两个单链表的头节点 headA 和 headB，找出并返回两个链表相交的起始节点。
 * 如果两个链表没有交点，返回 null。
 *
 * “相交”指的是两个链表从某个节点开始，之后的节点完全共享（是同一批节点对象），
 * 不是节点值相等而已。相交后不会再分开。
 *
 * 思路：
 * 1. 找两条链表第一个公共节点，没有就返回 null。
 * 2. 双指针各走完自己再接对方的头，路程 a+b = b+a，交点处相遇。
 * 3. 无交点时两人同时走到 null。
 * 复杂度：时间 O(m+n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： listA = 4 -> 1 -> 8 -> 4 -> 5
 *        listB = 5 -> 6 -> 1 -> 8 -> 4 -> 5
 *        其中 8 -> 4 -> 5 是两个链表共享的同一批节点
 * 输出： 相交起始节点（值为 8 的那个节点）
 *
 * 输入： listA = 2 -> 6 -> 4,  listB = 1 -> 5，两者无公共节点
 * 输出： null
 *
 * ——— 延伸 ———
 * - 先算长度，长的先走差值，再一起走，也能找交点。
 * - 哈希记下 A 的节点，扫 B，第一次命中就是交点。空间 O(m)。
 * - 相交后不会再分叉，第一个公共节点之后全共享。
 *
 * ——— 常见追问 ———
 * Q: 为什么走完自己接对方？
 * A: A 走 a+c 再走 B 的 b，B 走 b+c 再走 A 的 a。两边都是 a+b+c，交点处碰面。
 *
 * Q: 不相交会不会死循环？
 * A: 两人最后都走到 null，a === b === null，循环停。
 *
 * Q: 交点是头？
 * A: 两条完全重合，一开始 a === b，直接返回。
 *
 * Q: 比的是节点还是值？
 * A: 节点引用。值相同但不是同一个对象，不算相交。
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
  let a = headA;
  let b = headB;
  while (a !== b) {
    a = a ? a.next : headB; // 走完 A 接 B，抹平长度差
    b = b ? b.next : headA;
  }
  return a; // 相遇是交点；都走到 null 就是不相交
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
