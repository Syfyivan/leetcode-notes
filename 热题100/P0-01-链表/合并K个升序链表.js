/**
 * 合并 K 个升序链表（LeetCode 23）
 *
 * 给定一个链表数组 lists，每个链表都已经按升序排列。
 * 请将所有链表合并到一个升序链表中，返回合并后的链表。
 *
 * 思路：
 * 1. k 条升序链表合成一条。
 * 2. 分治两两合并，和归并排序同一套。
 * 3. 空数组或全空链表返回 null。
 * 复杂度：时间 O(N log k)，空间 O(log k)
 *
 * ——— 示例 ———
 * 输入： lists = [[1,4,5],[1,3,4],[2,6]]
 * 输出： [1,1,2,3,4,4,5,6]
 *
 * 输入： lists = []
 * 输出： []
 *
 * 输入： lists = [[]]
 * 输出： []
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
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  const mergeTwo = (a, b) => {
    const dummy = new ListNode(0);
    let cur = dummy;
    while (a && b) {
      if (a.val <= b.val) { cur.next = a; a = a.next; }
      else { cur.next = b; b = b.next; }
      cur = cur.next;
    }
    cur.next = a || b;
    return dummy.next;
  };
  const merge = (l, r) => {
    if (l === r) return lists[l];
    if (l > r) return null;
    const m = (l + r) >> 1;
    return mergeTwo(merge(l, m), merge(m + 1, r));
  };
  return merge(0, lists.length - 1);
}

// —— 自测 ——
console.log(toArray(mergeKLists([build([1, 4, 5]), build([1, 3, 4]), build([2, 6])])));
// 期望： [1,1,2,3,4,4,5,6]
console.log(toArray(mergeKLists([])));         // 期望： []
console.log(toArray(mergeKLists([build([])]))); // 期望： []

module.exports = { ListNode, build, toArray, mergeKLists };
