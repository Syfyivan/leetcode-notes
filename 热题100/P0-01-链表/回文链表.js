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
 *
 * ——— 延伸 ———
 * - 放进数组再双指针，好写，空间 O(n)。进阶要 O(1) 才翻后半。
 * - 判断回文串（LC125）是同一题的数组版。
 * - 比较完可以把后半再翻回来，题目不要求，面试可能提。
 *
 * ——— 常见追问 ———
 * Q: 快慢指针停在哪？
 * A: 偶数停在前半尾，奇数停在正中间。后半从 slow.next 起，中点不参与比较。
 *
 * Q: 为什么翻后半不翻前半？
 * A: 前半的头还要拿来逐个比。翻前半头就丢了。
 *
 * Q: 空间真是 O(1)？
 * A: 改了原链表。不允许改就只能数组或递归栈，O(n)。
 *
 * Q: 空 / 单节点？
 * A: 正反一样，直接 true。
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
  let p2 = prev; // 后半已经翻过来，从头比
  while (p2) { // 以后半长度为准，奇数中点自然跳过
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
