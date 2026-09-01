/**
 * 热题 100 · K个一组翻转链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * K 个一组翻转链表（LeetCode 25）
 *
 * 给定链表的头节点 head，每 k 个节点一组翻转，返回翻转后的链表。
 * k 是正整数，且小于或等于链表长度。
 * 如果节点总数不是 k 的整数倍，最后剩下的不足 k 个的节点保持原有顺序。
 *
 * 进阶：只能用常数额外空间。
 *
 * 思路：
 * 1. 每 k 个节点翻一段，不够 k 个保持原样。
 * 2. 虚拟头。每次先数 k 个，够就翻转这一段，前驱接到新头。
 * 3. k=1 或空链表直接返回。翻转后原头变成尾，下一组从它后面接。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： 1 -> 2 -> 3 -> 4 -> 5,  k = 2
 * 输出： 2 -> 1 -> 4 -> 3 -> 5
 *
 * 输入： 1 -> 2 -> 3 -> 4 -> 5,  k = 3
 * 输出： 3 -> 2 -> 1 -> 4 -> 5
 *
 * 输入： 1 -> 2 -> 3 -> 4 -> 5,  k = 1
 * 输出： 1 -> 2 -> 3 -> 4 -> 5
 *
 * ——— 延伸 ———
 * - 最后不足 k 也翻：探路那步去掉，剩多少翻多少。
 * - k=2 就是两两交换。这题是它的通用版。
 * - 递归：翻前 k 个，剩下的递归接上。栈是 O(n/k)。
 * - 反转区间 [left, right]（LC92）同一套指针，只翻一段。
 *
 * ——— 常见追问 ———
 * Q: 为什么先数 k 个再翻？
 * A: 不够 k 要保持原样。先探路，不够直接返回，翻过的不用还原。
 *
 * Q: 翻这一段时 p 为什么一开始等于 next？
 * A: 这段新尾巴要接下一段。每个节点翻的时候就指向后面，翻完自然接上。
 *
 * Q: prev 为什么要挪到 newTail（原头）？
 * A: 翻完原头变成这段的尾巴，下一组的前驱就是它。还停在 dummy 会接错。
 *
 * Q: 时间空间？
 * A: 每段走两遍（数 + 翻），一共 O(n)。几个指针 O(1)。递归版栈 O(n/k)。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (true) {
    let tail = prev;
    for (let i = 0; i < k; i++) {
      tail = tail.next;
      if (!tail) return dummy.next; // 不够 k 个，不翻
    }
    const next = tail.next; // 下一段头，翻完尾巴要接它
    let curr = prev.next;
    let p = next; // 从后往前翻，一开始就指向下一段
    while (curr !== next) {
      const nxt = curr.next;
      curr.next = p;
      p = curr;
      curr = nxt;
    }
    const newTail = prev.next; // 原头变尾
    prev.next = tail; // 前驱接到这段新头
    prev = newTail;
  }
}

/**
 * 延伸 1：递归分组反转
 *
 * 需求：每次只处理前 k 个节点，剩余链表递归处理；不足 k 个保持原样。
 *
 * 思路：先探出第 k 个节点后的边界，再把 [head, boundary) 反转，原 head 接递归结果。
 *
 * ——— 示例 ———
 * 示例：1→2→3→4→5，k=2，输出 2→1→4→3→5。
 *
 * 复杂度：时间 O(n)，递归栈 O(n/k)。
 */
function reverseKGroupRecursive(head, k) {
  if (k <= 1 || !head) return head;
  let boundary = head;
  for (let i = 0; i < k; i++) {
    if (!boundary) return head;
    boundary = boundary.next;
  }
  let prev = boundary;
  let current = head;
  for (let i = 0; i < k; i++) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  head.next = reverseKGroupRecursive(boundary, k);
  return prev;
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
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 2))); // [2, 1, 4, 3, 5]
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 3))); // [3, 2, 1, 4, 5]
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 1))); // [1, 2, 3, 4, 5]

module.exports = { ListNode, reverseKGroup, reverseKGroupRecursive, build, toArray };
