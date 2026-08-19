/**
 * 排序链表（LeetCode 148）
 *
 * 给定链表的头节点 head，请将其按升序排列并返回排序后的链表。
 *
 * 进阶：能否在 O(n log n) 时间复杂度和常数级空间复杂度下完成？
 *
 * ——— 示例 ———
 * 输入： head = [4,2,1,3]
 * 输出： [1,2,3,4]
 *
 * 输入： head = [-1,5,3,4,0]
 * 输出： [-1,0,3,4,5]
 *
 * 输入： head = []
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
 * @param {ListNode} head
 * @return {ListNode}
 */
function sortList(head) {
  // TODO
}

// —— 自测 ——
console.log(toArray(sortList(build([4, 2, 1, 3]))));     // 期望： [1,2,3,4]
console.log(toArray(sortList(build([-1, 5, 3, 4, 0])))); // 期望： [-1,0,3,4,5]
console.log(toArray(sortList(build([]))));               // 期望： []

module.exports = { ListNode, build, toArray, sortList };
