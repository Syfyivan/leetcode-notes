/**
 * 热题 100 · 反转链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 反转链表（LeetCode 206）
 *
 * 给定单链表的头节点 head，反转链表，返回反转后的头节点。
 *
 * 思路：
 * 1. 每个 next 改指前一个节点，原头变尾。
 * 2. 递归先翻后面，再让后继指回自己。迭代用 prev / curr 逐个改指针。
 * 3. 空链表或单节点直接返回。递归必须切断 head.next，否则成环。
 * 复杂度：时间 O(n)，空间 递归 O(n) / 迭代 O(1)
 *
 * ——— 示例 ———
 * 输入： 1 -> 2 -> 3 -> 4 -> 5
 * 输出： 5 -> 4 -> 3 -> 2 -> 1
 *
 * 输入： 1 -> 2
 * 输出： 2 -> 1
 *
 * 输入： 空链表（null）
 * 输出： 空链表（null）
 *
 * 迭代、递归都可以，自己挑一种先写，写完再换另一种。
 *
 * ——— 延伸 ———
 * - 反转区间 [left, right]（LC92）：走到 left 前一个，只翻一段。
 * - K 个一组翻、两两交换都是这题加分组。
 * - 迭代省栈，递归好写。面试两种都要会。
 *
 * ——— 常见追问 ———
 * Q: 递归为什么必须 head.next = null？
 * A: 不切断的话原头还指着后继，后继又指回来，成环。新尾巴必须变成 null。
 *
 * Q: 迭代里 next 为什么先存？
 * A: curr.next 马上改成 prev，不存就丢后面整串。
 *
 * Q: 空链表 / 单节点？
 * A: 递归入口直接返回。迭代 while 不进，prev 停在 null 或那个单节点。
 *
 * Q: 复杂度？
 * A: 都是 O(n)。递归栈 O(n)，迭代 O(1)，空间敏感用迭代。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  if(!head || !head.next) return head;

  const newHead = reverseList(head.next);
  head.next.next = head; // 后继指回来
  head.next = null;      // 切断原指向，否则成环

  return newHead;
}

/**
 * 迭代法（双指针）
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseListIterative(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next; // 下一步要走这里，先存
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

/**
 * 延伸 1：反转指定区间（LeetCode 92）
 *
 * 需求：只反转第 left 到 right 个节点，其余节点顺序不变。
 *
 * 思路：dummy 走到 left 前一位，把区间内后续节点依次抽出并插到区间头部。
 *
 * ——— 示例 ———
 * 示例：1→2→3→4→5，left=2，right=4，输出 1→4→3→2→5。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 */
function reverseBetween(head, left, right) {
  if (!head || left === right) return head;
  const dummy = new ListNode(0, head);
  let before = dummy;
  for (let i = 1; i < left; i++) before = before.next;
  const tail = before.next;
  for (let i = 0; i < right - left; i++) {
    const moved = tail.next;
    tail.next = moved.next;
    moved.next = before.next;
    before.next = moved;
  }
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
console.log(toArray(reverseList(build([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(toArray(reverseList(build([1, 2]))));          // [2, 1]
console.log(toArray(reverseList(build([]))));              // []

// —— 迭代版自测 ——
console.log(toArray(reverseListIterative(build([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(toArray(reverseListIterative(build([1, 2]))));          // [2, 1]
console.log(toArray(reverseListIterative(build([]))));              // []

module.exports = { ListNode, reverseList, reverseListIterative, reverseBetween, build, toArray };
