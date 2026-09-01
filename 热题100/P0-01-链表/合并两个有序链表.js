/**
 * 热题 100 · 合并两个有序链表
 *
 * 优先级：Hot 100 · P0
 */

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
 *
 * ——— 延伸 ———
 * - 递归：谁小谁当头，next 接 merge(剩下, 另一条)。
 * - 合并 k 条（LC23）就是反复调这题。
 * - 数组版归并同一思路，下标替换指针。
 *
 * ——— 常见追问 ———
 * Q: 为什么用虚拟头？
 * A: 不知道谁先当头。dummy 垫着，循环只负责接，返回 dummy.next。
 *
 * Q: 相等时接谁？
 * A: 都行。这里 <= 让 list1 优先，稳定。
 *
 * Q: 一条走完？
 * A: 另一条已经有序，直接挂上。空链表也走这条。
 *
 * Q: 递归空间？
 * A: 迭代 O(1)。递归每层一个栈帧，O(m+n)。
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
  cur.next = list1 || list2; // 剩下已有序，整段挂上
  return dummy.next;
}

/**
 * 延伸 1：递归合并
 *
 * 需求：不用 dummy 指针，递归决定每一位由哪条链表提供。
 *
 * 思路：较小节点作为当前头，它的 next 接“两条剩余链表”的合并结果。
 *
 * ——— 示例 ———
 * 示例：1→2→4 与 1→3→4，输出 1→1→2→3→4→4。
 *
 * 复杂度：时间 O(m+n)，递归栈 O(m+n)。
 */
function mergeTwoListsRecursive(list1, list2) {
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  }
  list2.next = mergeTwoListsRecursive(list1, list2.next);
  return list2;
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

module.exports = { ListNode, mergeTwoLists, mergeTwoListsRecursive, build, toArray };
