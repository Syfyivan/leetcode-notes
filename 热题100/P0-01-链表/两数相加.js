/**
 * 热题 100 · 两数相加
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 两数相加（LeetCode 2）
 *
 * 给定两个非空链表 l1 和 l2，表示两个非负整数。
 * 它们各自的位数是按照逆序的方式存储的，每个节点只能存储一位数字。
 * 请将两个数相加，并以相同形式返回一个表示和的链表。
 * 可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * 思路：
 * 1. 两个逆序存的数字相加，结果也用逆序链表返回。
 * 2. 虚拟头，同步走两个链表，把进位一起加。
 * 3. 一长一短时短的当 0。最后还有进位要再挂一个节点。
 * 复杂度：时间 O(max(m,n))，空间 O(1) 不计结果链表
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
 *
 * ——— 延伸 ———
 * - 数字正序存（LC445）：先压栈再加，或先反转再套这题。
 * - 字符串大数加法同一套路：从尾往前加，维护进位。
 * - 相乘（LC43）也是按位 + 进位，结果数组更长。
 *
 * ——— 常见追问 ———
 * Q: 为什么 while 还要看 carry？
 * A: 最后可能多出一位，5+5=10。进位还在就要再挂一个节点。
 *
 * Q: 一长一短怎么办？
 * A: 短的当 0。走完的那边不再前进，条件写成 l1 ? l1.val : 0。
 *
 * Q: 虚拟头干什么？
 * A: 第一位也可能有，不知道新头是谁。dummy 垫着，返回 dummy.next。
 *
 * Q: 为什么不先转成数字再加？
 * A: 链表可能很长，超过 Number.MAX_SAFE_INTEGER 会丢精度。
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
  const dummy = new ListNode(0); // 不知道新头是谁，垫一格
  let cur = dummy;
  let carry = 0;
  while (l1 || l2 || carry) { // 进位还在也要多挂一位
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    cur.next = new ListNode(sum % 10); // 只留个位，十位进到下一轮
    cur = cur.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}

/**
 * 延伸 1：数字按正序存放（LeetCode 445）
 *
 * 需求：链表头是最高位，不能直接从头相加；返回结果也保持正序。
 *
 * 思路：两条链表分别压栈，从末位弹出相加；新节点每次插到结果头部。
 *
 * ——— 示例 ———
 * 示例：7→2→4→3 加 5→6→4，输出 7→8→0→7。
 *
 * 复杂度：时间 O(m+n)，空间 O(m+n)。
 */
function addTwoNumbersForward(l1, l2) {
  const a = [];
  const b = [];
  for (; l1; l1 = l1.next) a.push(l1.val);
  for (; l2; l2 = l2.next) b.push(l2.val);
  let carry = 0;
  let head = null;
  while (a.length || b.length || carry) {
    const sum = (a.pop() || 0) + (b.pop() || 0) + carry;
    head = new ListNode(sum % 10, head);
    carry = Math.floor(sum / 10);
  }
  return head;
}

// —— 自测 ——
console.log(toArray(addTwoNumbers(build([2, 4, 3]), build([5, 6, 4]))));
// 期望： [7,0,8]
console.log(toArray(addTwoNumbers(build([0]), build([0]))));
// 期望： [0]
console.log(toArray(addTwoNumbers(build([9, 9, 9, 9, 9, 9, 9]), build([9, 9, 9, 9]))));
// 期望： [8,9,9,9,0,0,0,1]

module.exports = { ListNode, build, toArray, addTwoNumbers, addTwoNumbersForward };
