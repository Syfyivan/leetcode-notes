/**
 * 回文链表（LeetCode 234）
 *
 * 给定单链表的头节点 head，判断该链表是否为回文链表（正着读和反着读一样）。
 * 是返回 true，否则返回 false。
 *
 * 进阶：能不能做到时间 O(n)、空间 O(1)？（提示只在此点到为止，不给做法）
 *
 * 思路：
 * 1. 判断正着反着读是否一样。
 * 2. 快慢指针找中点，反转后半段，再和前半逐个比。
 * 3. 空或单节点是回文。奇数个时中点不参与比较。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： 1 -> 2 -> 2 -> 1
 * 输出： true
 *
 * 输入： 1 -> 2 -> 3 -> 2 -> 1
 * 输出： true
 *
 * 输入： 1 -> 2
 * 输出： false
 *
 * 输入： 1（单节点）
 * 输出： true
 *
 * 输入： 空链表（null）
 * 输出： true
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
function isPalindrome(head) {
  if (!head || !head.next) return true;
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // slow 停在前半尾（奇数时正中间），从其后反转
  let prev = null;
  let curr = slow.next;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let p1 = head;
  let p2 = prev;
  while (p2) {
    if (p1.val !== p2.val) return false;
    p1 = p1.next;
    p2 = p2.next;
  }
  return true;
}

// —— 小工具：数组建链表 ——
function build(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

// —— 自测 ——
console.log(isPalindrome(build([1, 2, 2, 1])));    // true
console.log(isPalindrome(build([1, 2, 3, 2, 1]))); // true
console.log(isPalindrome(build([1, 2])));          // false
console.log(isPalindrome(build([1])));             // true
console.log(isPalindrome(build([])));              // true

module.exports = { ListNode, isPalindrome, build };
