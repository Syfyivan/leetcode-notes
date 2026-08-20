/**
 * 合并两个有序链表（LeetCode 21）
 *
 * 给定两个升序排列的链表 list1 和 list2，合并成一个新的升序链表并返回。
 * 新链表由原来两个链表的节点拼接而成。
 *
 * ——— 示例 ———
 * 输入： list1 = 1 -> 2 -> 4,  list2 = 1 -> 3 -> 4
 * 输出： 1 -> 1 -> 2 -> 3 -> 4 -> 4
 *
 * 输入： list1 = 空,  list2 = 空
 * 输出： 空链表（null）
 *
 * 输入： list1 = 空,  list2 = 0
 * 输出： 0
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
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
console.log(toArray(mergeTwoLists(build([1, 2, 4]), build([1, 3, 4])))); // [1, 1, 2, 3, 4, 4]
console.log(toArray(mergeTwoLists(build([]), build([]))));               // []
console.log(toArray(mergeTwoLists(build([]), build([0]))));             // [0]

module.exports = { ListNode, mergeTwoLists, build, toArray };
