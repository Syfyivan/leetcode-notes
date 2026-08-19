/**
 * 两数相加（LeetCode 2）
 *
 * 给定两个非空链表 l1 和 l2，表示两个非负整数。
 * 它们各自的位数是按照逆序的方式存储的，每个节点只能存储一位数字。
 * 请将两个数相加，并以相同形式返回一个表示和的链表。
 * 可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * ——— 示例 ———
 * 输入： l1 = [2,4,3], l2 = [5,6,4]  （表示 342 + 465）
 * 输出： [7,0,8]  （表示 807）
 *
 * 输入： l1 = [0], l2 = [0]
 * 输出： [0]
 *
 * 输入： l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
 * 输出： [8,9,9,9,0,0,0,1]
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
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function addTwoNumbers(l1, l2) {
  // TODO
}

// —— 自测 ——
console.log(toArray(addTwoNumbers(build([2, 4, 3]), build([5, 6, 4]))));
// 期望： [7,0,8]
console.log(toArray(addTwoNumbers(build([0]), build([0]))));
// 期望： [0]
console.log(toArray(addTwoNumbers(build([9, 9, 9, 9, 9, 9, 9]), build([9, 9, 9, 9]))));
// 期望： [8,9,9,9,0,0,0,1]

module.exports = { ListNode, build, toArray, addTwoNumbers };
