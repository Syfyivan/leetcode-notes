/**
 * 热题 100 · 合并两个有序链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 合并两个有序链表（LeetCode 21 · 简单）
 *
 * 【题目描述】
 * 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
 *
 * ——— 解法一：迭代双指针法（推荐，O(1) 空间） ———
 * 【核心思维模型】
 * 1. 哨兵节点 dummy：
 *    合并开始前，不知道 list1 和 list2 谁的头节点更小。使用 dummy 节点作为新链表的前驱锚点，循环中只需无脑将较小节点拼在 cur.next 上。
 * 2. 贪心比较与指针推进：
 *    - 比较 list1.val 和 list2.val：
 *      - 若 list1.val <= list2.val，则 cur.next = list1，list1 向后移动一步；
 *      - 否则 cur.next = list2，list2 向后移动一步。
 *    - cur 指针同步后移：cur = cur.next。
 * 3. 尾部拼接（关键提速点）：
 *    当其中一条链表走到末尾（变为 null）时，循环结束。由于链表本身是有序的，不需要再逐个遍历剩余节点，直接一行代码 `cur.next = list1 || list2` 将另一条未走完的整串链表直接挂到尾部即可！
 *
 * ——— 解法二：递归回溯法 ———
 * 【核心思路】
 * 1. 递归终止条件（Base Case）：
 *    - 若 list1 为 null，说明 list1 处理完毕，直接返回 list2。
 *    - 若 list2 为 null，直接返回 list1。
 * 2. 递归递进：
 *    - 若 list1.val <= list2.val，说明 list1 是当前的最小头节点，递归合并 list1.next 和 list2，并将结果赋给 list1.next，返回 list1。
 *    - 否则将结果赋给 list2.next，返回 list2。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(m + n)，其中 m 和 n 分别是两条链表的长度。每一次循环或递归都会把一个节点拼接到结果链表上，总遍历次数最多为 m + n。
 * 空间复杂度：
 *   - 迭代法：O(1)，仅使用 dummy、cur 等常数个指针变量，所有节点都是原链表节点拼接（原地操作）。
 *   - 递归法：O(m + n)，递归调用栈深度最大为两条链表长度之和 m + n。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 迭代解法
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0); // 哨兵节点
  let cur = dummy;

  // 1. 双指针同时存在时，谁小接谁
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

  // 2. 将剩余未走完的链表整段挂载到末尾
  cur.next = list1 || list2;

  return dummy.next;
}

/**
 * 延伸 1：递归合并
 *
 * 需求：不用循环与 dummy 变量，利用递归定义优雅合并。
 *
 * 思路：
 * 1. 若其中一条为空，直接返回另一条。
 * 2. 选出两链表当前较小的头节点作为合并后的头节点。
 * 3. 该头节点的 next 递归指向剩余节点的合并结果。
 *
 * 复杂度：时间 O(m + n)，空间 O(m + n) 递归栈。
 *
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoListsRecursive(list1, list2) {
  // 1. 递归基底
  if (!list1) return list2;
  if (!list2) return list1;

  // 2. 递归连接较小者
  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
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
 * Q1: 节点值相等时优先接哪一条链表？算法是稳定的吗？
 * A1: 采用 `list1.val <= list2.val` 时，优先连接 list1 的节点，保持了相同元素的原有相对顺序，算法是稳定的（Stable）。
 *
 * Q2: 为什么循环结束后直接 `cur.next = list1 || list2` 是正确的？
 * A2: 与数组归并不同，单向链表的每个节点本身就已经连着它的后续有序节点。只要把指针指过去，后续整串子链表就会整体并入，无需 $O(k)$ 逐个搬运。
 *
 * Q3: 为什么这道题是归并排序（Merge Sort）和 LeetCode 23（合并 K 个升序链表）的核心基石？
 * A3: 链表归并排序的“治”阶段以及合并 K 个链表的分治合并，底层的最小原子操作全部依赖于合并两个有序链表。
 */

// —— 自测（迭代版） ——
console.log(toArray(mergeTwoLists(build([1, 2, 4]), build([1, 3, 4])))); // [1, 1, 2, 3, 4, 4]
console.log(toArray(mergeTwoLists(build([]), build([]))));               // []
console.log(toArray(mergeTwoLists(build([]), build([0]))));              // [0]
console.log(toArray(mergeTwoLists(build([5]), build([1, 2, 3]))));       // [1, 2, 3, 5]

// —— 递归版自测 ——
console.log(toArray(mergeTwoListsRecursive(build([1, 2, 4]), build([1, 3, 4])))); // [1, 1, 2, 3, 4, 4]
console.log(toArray(mergeTwoListsRecursive(build([2]), build([1]))));             // [1, 2]

module.exports = { ListNode, mergeTwoLists, mergeTwoListsRecursive, build, toArray };
