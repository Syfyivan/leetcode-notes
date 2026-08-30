/**
 * 合并两个有序链表（LeetCode 21）
 *
 * 给定两个升序排列的链表 list1 和 list2，合并成一个新的升序链表并返回。
 * 新链表由原来两个链表的节点拼接而成。
 *
 * 思路：
 * 1. 两条升序链表合成一条升序链表。
 * 2. 虚拟头 + 双指针，谁小接谁，接完走一步。
 * 3. 一条走完后把另一条剩余直接挂上。空链表也能接。
 * 复杂度：时间 O(m+n)，空间 O(1)
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
  const dummy = new ListNode(0); // 虚拟头，省掉处理新头的分支
  let cur = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }
  cur.next = list1 || list2;
  return dummy.next;
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
