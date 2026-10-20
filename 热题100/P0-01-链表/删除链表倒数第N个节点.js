/**
 * 热题 100 · 删除链表倒数第N个节点
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 删除链表的倒数第 N 个节点（LeetCode 19 · 中等）
 *
 * 【题目描述】
 * 给你一个链表，删除链表的倒数第 n 个节点，并且返回链表的头节点。
 * 进阶：你能尝试使用一趟扫描实现吗？
 *
 * ——— 解法一：快慢指针法（One Pass 单次遍历，推荐） ———
 * 【核心思维模型】
 * 单链表删除一个节点，核心必须找到该节点的【直接前驱节点】。
 * 假设链表长度为 L，倒数第 n 个节点的前驱节点是从头开始的第 L - n 个节点。
 *
 * 1. 哨兵节点 dummy：
 *    创建 dummy(0, head)。
 *    - 核心作用：当需要删除原头节点（即 n == L）时，slow 刚好停留在 dummy 上，
 *      执行 slow.next = slow.next.next 能统一处理删除头节点的情况，无需任何 if 特判。
 *
 * 2. 构造固定间距窗口（Gap = n）：
 *    - 初始化 fast = dummy, slow = dummy。
 *    - 先让 fast 向前移动 n 步。此时 fast 和 slow 之间相隔 n 个节点。
 *
 * 3. 双指针同步前进：
 *    - 同时向后移动 fast 和 slow，直到 fast.next === null（即 fast 到达链表尾节点）。
 *    - 此时 slow 恰好停在【待删除节点的前驱节点】上！
 *
 * 4. 节点删除：
 *    slow.next = slow.next.next;
 *    返回 dummy.next。
 *
 * ——— 图解快慢指针定位过程（以 1->2->3->4->5, n=2 为例） ———
 * 初始（fast 先走 2 步）：
 *   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
 *   slow          fast
 *
 * 同步后移直到 fast.next === null：
 *   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
 *                      slow      fast
 *
 * 此时待删除的是倒数第 2 个（节点 4），slow 稳稳停在节点 3（前驱）：
 *   slow.next = slow.next.next（3 直接跳过 4 连接 5）
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(L)，其中 L 为链表长度。fast 指针遍历整个链表恰好一次。
 * 空间复杂度：O(1)，仅使用 fast, slow 常数个辅助指针。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 快慢双指针解法（一趟扫描）
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;

  // 1. fast 指针先向前移动 n 步
  for (let i = 0; i < n; i++) {
    if (!fast.next) return head; // 健壮性防线：如果 n 大于链表长度则原样返回
    fast = fast.next;
  }

  // 2. fast 与 slow 同步向前，直到 fast 到达链表末尾节点
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }

  // 3. 此时 slow 停在待删除节点的前驱上，跳过目标节点
  slow.next = slow.next.next;

  return dummy.next;
}

/**
 * 延伸 1：两次遍历（长度法）
 *
 * 需求：先统计链表总长度 length，再通过正向索引找到待删除节点的前驱。
 *
 * 思路：
 * 1. 遍历一遍计算总长度 length。
 * 2. 待删除节点是从前往后的第 length - n + 1 个，其前驱是第 length - n 个。
 * 3. dummy 走 length - n 步到达前驱，执行删除。
 *
 * 复杂度：时间 O(L)（遍历两遍），空间 O(1)。
 *
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEndWithLength(head, n) {
  let length = 0;
  for (let node = head; node; node = node.next) length++;
  if (n < 1 || n > length) return head;

  const dummy = new ListNode(0, head);
  let before = dummy;

  // 移动到待删除节点的前驱
  for (let i = 0; i < length - n; i++) {
    before = before.next;
  }

  // 删除目标节点
  before.next = before.next.next;

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

/**
 * ——— 常见面试追问 ———
 * Q1: 为什么快慢指针必须从 dummy 起步，而不是直接从 head 起步？
 * A1: 如果从 head 起步且删除的是头节点（例如链表 [1,2], n=2），fast 走到末尾时 slow 会停在头节点自身，而无法获取头节点的前驱。从 dummy 起步能让 slow 停在 dummy（即头节点的前驱），一行代码统一搞定。
 *
 * Q2: while 循环条件为什么是 `while (fast.next)` 而不是 `while (fast)`？
 * A2: 如果用 `while (fast)`，当 fast 走到 null 时，slow 会停在【待删除节点本身】上；而单向链表删除节点必须停在【待删除节点的前驱】上。因此当 fast 停在末尾最后一个有效节点（即 fast.next 为 null）时循环停止，slow 恰好停在前驱。
 */

// —— 自测 ——
console.log(toArray(removeNthFromEnd(build([1, 2, 3, 4, 5]), 2))); // [1, 2, 3, 5]（删除中间节点）
console.log(toArray(removeNthFromEnd(build([1]), 1)));             // []（删除单节点头节点）
console.log(toArray(removeNthFromEnd(build([1, 2]), 2)));          // [2]（删除头节点）
console.log(toArray(removeNthFromEnd(build([1, 2]), 1)));          // [1]（删除尾节点）

// —— 两次遍历版自测 ——
console.log(toArray(removeNthFromEndWithLength(build([1, 2, 3, 4, 5]), 2))); // [1, 2, 3, 5]
console.log(toArray(removeNthFromEndWithLength(build([1, 2]), 2)));          // [2]

module.exports = { ListNode, removeNthFromEnd, removeNthFromEndWithLength, build, toArray };
