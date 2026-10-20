/**
 * 热题 100 · 相交链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 相交链表（LeetCode 160 · 简单）
 *
 * 【题目描述】
 * 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。
 * 如果两个链表不存在相交节点，返回 null 。
 *
 * “相交”指的是两个链表在内存中从某个节点开始共享同一段链表（同一个节点引用对象），
 * 而非单纯的节点值相等。相交之后不会再分叉。
 *
 * 进阶：你能否设计一个时间复杂度 O(m + n) 、仅用 O(1) 内存的解决方案？
 *
 * ——— 解法一：双指针浪漫相遇法（推荐，O(1) 空间） ———
 *
 * 【核心数学原理（“走过你走过的路”）：消除长度差】
 * 设链表 A 独有长度为 a，链表 B 独有长度为 b，两条链表相交后的公共段长度为 c（若不相交则 c = 0）。
 *   - 链表 A 总长度 = a + c
 *   - 链表 B 总长度 = b + c
 *
 * 1. 指针转移机制：
 *    - 指针 pA 从 headA 出发，走完链表 A（步数 a + c）遇到 null 时，立即跳到 headB；
 *    - 指针 pB 从 headB 出发，走完链表 B（步数 b + c）遇到 null 时，立即跳到 headA。
 *
 * 2. 步数恒等推导：
 *    - 当 pA 到达交点时，走过的总步数为： (a + c) + b
 *    - 当 pB 到达交点时，走过的总步数为： (b + c) + a
 *    - 因为 (a + c + b) === (b + c + a)，两人走过的总距离完全相等！
 *    - 因此，当两个指针步数相同时，必定【同时到达相交起点】！
 *
 * 3. 不相交时的优雅退出（c = 0）：
 *    - pA 走过 a + b 步后到达 null；
 *    - pB 走过 b + a 步后到达 null；
 *    - 此时 pA === pB === null，`while (pA !== pB)` 条件为 false 退出循环，安全返回 null，绝不死循环！
 *
 * ——— 解法二：计算长度差法（常规双指针） ———
 * 1. 分别遍历两条链表，求出长度 lenA 和 lenB。
 * 2. 计算差值 diff = |lenA - lenB|。
 * 3. 让较长链表的指针先向前移动 diff 步，使两条链表的剩余长度对齐。
 * 4. 随后两个指针同速前进，首次相遇的节点即为交点。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(m + n)，其中 m 和 n 分别是两链表的长度。两个指针最多各遍历 m + n 步。
 * 空间复杂度：O(1)，仅需 pA 和 pB 两个指针。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 双指针浪漫相遇法（O(1) 空间）
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode|null}
 */
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let pA = headA;
  let pB = headB;

  // 当 pA 与 pB 相遇时退出（相遇在交点，或二者同时走到 null）
  while (pA !== pB) {
    pA = pA ? pA.next : headB; // 走完 A 后转去走 B
    pB = pB ? pB.next : headA; // 走完 B 后转去走 A
  }

  return pA; // 若相交返回交点节点，若不相交此时 pA 为 null
}

/**
 * 延伸 1：长度差对齐法
 *
 * 需求：先求两条链表长度，长链表先走差值步数，再同步前进寻找交点。
 *
 * 复杂度：时间 O(m + n)，空间 O(1)。
 *
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode|null}
 */
function getIntersectionNodeWithDiff(headA, headB) {
  let lenA = 0;
  let lenB = 0;
  for (let p = headA; p; p = p.next) lenA++;
  for (let p = headB; p; p = p.next) lenB++;

  let pA = headA;
  let pB = headB;

  // 让 pA 永远指向较长的那一条
  if (lenA < lenB) {
    [pA, pB] = [pB, pA];
    [lenA, lenB] = [lenB, lenA];
  }

  // 长链表先走差值步数
  for (let i = 0; i < lenA - lenB; i++) {
    pA = pA.next;
  }

  // 齐头并进寻找交点
  while (pA && pB) {
    if (pA === pB) return pA;
    pA = pA.next;
    pB = pB.next;
  }

  return null;
}

/**
 * 延伸 2：哈希表法
 *
 * 思路：将链表 A 的所有节点存入 Set，遍历链表 B 检查是否在 Set 中存在。
 * 复杂度：时间 O(m + n)，空间 O(m)。
 */
function getIntersectionNodeWithSet(headA, headB) {
  const nodes = new Set();
  for (let node = headA; node; node = node.next) nodes.add(node);
  for (let node = headB; node; node = node.next) {
    if (nodes.has(node)) return node;
  }
  return null;
}

// —— 小工具：build 建普通链表；makeIntersect 造出真正共享尾部的两条链表 ——
function build(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

// onlyA、onlyB 为各自独有的前缀值数组，common 为共享尾部的值数组
function makeIntersect(onlyA, onlyB, common) {
  const shared = build(common);
  const linkTo = (arr) => {
    if (arr.length === 0) return shared;
    const head = build(arr);
    let p = head;
    while (p.next) p = p.next;
    p.next = shared;
    return head;
  };
  return [linkTo(onlyA), linkTo(onlyB), shared];
}

/**
 * ——— 常见面试追问 ———
 * Q1: 为什么两个单链表相交之后不可能再分叉？
 * A1: 因为单链表每个节点只有唯一的 `.next` 指针。如果相交，说明两个链表指向了同一个节点，而该节点只能有一个 `.next` 后继，因此后续的所有节点必定完全共享。
 *
 * Q2: 判断相交比对的是节点值（val）还是节点内存引用？
 * A2: 必须比对节点内存引用（`pA === pB`）。不同节点可以拥有相同的 val 值，只有引用相同时才代表同一个物理节点。
 */

// —— 自测 ——
const [a1, b1, cross] = makeIntersect([4, 1], [5, 6, 1], [8, 4, 5]);
console.log(getIntersectionNode(a1, b1) === cross); // true（返回值为 8 的那个共享节点引用）
console.log(getIntersectionNodeWithDiff(a1, b1) === cross); // true

const a2 = build([2, 6, 4]);
const b2 = build([1, 5]);
console.log(getIntersectionNode(a2, b2)); // null（不相交）
console.log(getIntersectionNodeWithDiff(a2, b2)); // null

module.exports = { ListNode, getIntersectionNode, getIntersectionNodeWithDiff, getIntersectionNodeWithSet, build, makeIntersect };
