/**
 * 删除链表的倒数第 N 个节点（LeetCode 19）
 *
 * 给定一个链表，删除链表的倒数第 n 个节点，返回头节点。
 *
 * 思路：
 * 1. 删掉倒数第 n 个节点，返回新头。
 * 2. 虚拟头 + 快指针先走 n 步，再和慢指针一起走，慢停在待删前驱。
 * 3. 删头时虚拟头兜住。n 超出长度则不删。
 * 复杂度：时间 O(n)，空间 O(1)
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
 *
 * ——— 延伸 ———
 * - 快先走 n 再一起走，找倒数第 k 个、旋转链表也能用。
 * - 两次遍历：先数长度，再走 length-n。多一遍，更好写。
 * - 删头时虚拟头兜住，返回 dummy.next。
 *
 * ——— 常见追问 ———
 * Q: 快指针为什么先走 n 步？
 * A: 快慢隔 n 个。快到尾巴时，慢刚好在待删前一个。单链表删节点必须拿前驱。
 *
 * Q: 为什么从 dummy 起步，不从头？
 * A: n 等于长度时删的是头。slow 停在 dummy 上，next 一跳就删掉头。
 *
 * Q: 快先走 n 步时中间空了？
 * A: n 比长度大。题目保证合法，这里直接返回原头。
 *
 * Q: 复杂度？
 * A: 一遍扫描 O(n)，几个指针 O(1)。
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
  const dummy = new ListNode(0, head); // 虚拟头，删头时不用特判
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i++) {
    if (!fast.next) return head; // n 超出长度，不删
    fast = fast.next;
  }
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next; // 跳过待删那个
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
console.log(toArray(removeNthFromEnd(build([1, 2, 3, 4, 5]), 2))); // [1, 2, 3, 5]
console.log(toArray(removeNthFromEnd(build([1]), 1)));             // []

module.exports = { ListNode, removeNthFromEnd, build, toArray };
