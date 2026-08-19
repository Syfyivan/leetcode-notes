/**
 * 删除链表的倒数第 N 个节点（LeetCode 19）
 *
 * 给定一个链表，删除链表的倒数第 n 个节点，返回头节点。
 *
 * ——— 示例 ———
 * 输入： 链表 1 -> 2 -> 3 -> 4 -> 5,  n = 2
 * 输出： 1 -> 2 -> 3 -> 5           （删掉倒数第 2 个，即节点 4）
 *
 * 输入： 链表 1,  n = 1
 * 输出： 空链表（null）
 *
 * 需要自己想清楚的边界（题目不额外规定，按你的判断处理）：
 *   - 删的是头节点时怎么办？
 *   - n 非法（比如超过链表长度）怎么办？
 *   - 空链表怎么办？
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEnd(head, n) {
  // TODO
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
console.log(toArray(removeNthFromEnd(build([1, 2, 3, 4, 5]), 2))); // [1, 2, 3, 5]
console.log(toArray(removeNthFromEnd(build([1]), 1)));             // []

module.exports = { ListNode, removeNthFromEnd, build, toArray };
