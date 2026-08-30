/**
 * 两两交换链表中的节点（LeetCode 24）
 *
 * 给定一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。
 * 必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
 *
 * 思路：
 * 1. 相邻两个节点互换，奇数个时最后一个不动。
 * 2. 虚拟头 + 三个指针：前驱、第一、第二，改完前驱跳到原第一。
 * 3. 不足两个就停。空链表和单节点直接返回。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： head = [1,2,3,4]
 * 输出： [2,1,4,3]
 *
 * 输入： head = []
 * 输出： []
 *
 * 输入： head = [1]
 * 输出： [1]
 */

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
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

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function swapPairs(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const a = prev.next;
    const b = a.next;
    prev.next = b;
    a.next = b.next;
    b.next = a;
    prev = a; // a 现在是这一对的尾
  }
  return dummy.next;
}

// —— 自测 ——
console.log(toArray(swapPairs(build([1, 2, 3, 4])))); // 期望： [2,1,4,3]
console.log(toArray(swapPairs(build([]))));           // 期望： []
console.log(toArray(swapPairs(build([1]))));          // 期望： [1]

module.exports = { ListNode, build, toArray, swapPairs };
