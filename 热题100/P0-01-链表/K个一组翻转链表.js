/**
 * 热题 100 · K个一组翻转链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * K 个一组翻转链表（LeetCode 25 · 困难）
 *
 * 【题目描述】
 * 给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。
 * k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，
 * 那么请将最后剩余的节点保持原有顺序。
 *
 * 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
 * 进阶：你可以设计一个只用 O(1) 额外内存空间的算法解决此问题吗？
 *
 * ——— 解法一：迭代 + 局部区间翻转（推荐，O(1) 空间） ———
 * 【核心思维模型】
 * 1. 哨兵节点 dummy：
 *    创建 dummy(0, head)，prev 初始指向 dummy。
 * 2. 探路判定（Look Ahead）：
 *    每组翻转前，先让 tail 指针从 prev 往后走 k 步。
 *    - 若中途遇到 null（剩余不足 k 个）：说明这组不需要翻转，直接结束，返回 dummy.next。
 *    - 若成功走完 k 步：锁定当前待翻转区间的头 (start = prev.next) 和尾 (tail)，以及下一组的头 (nextGroup = tail.next)。
 * 3. 局部区间翻转（调转指针）：
 *    将区间 [start, tail] 内的节点翻转，让它们反向指回，并让原头部（翻转后变成尾巴）指向 nextGroup。
 * 4. 重新拼接：
 *    - 前驱连接：prev.next = tail（prev 接上本组翻转后的新头节点）
 *    - 推进指针：prev 移动到 start（原 head，现在变成了新尾巴），作为下一组的前驱。
 *
 * ——— 4 步翻转流程图解（以 1->2->3->4->5, k=2 为例） ———
 * 初始状态：
 *   dummy -> [1 -> 2] -> [3 -> 4] -> 5
 *   prev      start tail  nextGroup
 *
 * 翻转第一组 [1, 2] 后：
 *   dummy -> 2 -> 1 -> 3 -> 4 -> 5
 *   prev           \
 *                   newTail (更新为下一组的 prev)
 *
 * ——— 解法二：递归分治法（思维自然，但占用递归栈空间） ———
 * 【核心思路】
 * 1. 同样先向后探路 k 步，若不足 k 个直接返回 head。
 * 2. 将当前组的前 k 个节点进行翻转。
 * 3. 让当前组翻转后的尾节点（即原 head）的 next 指向对剩余链表递归调用的返回值：
 *    head.next = reverseKGroupRecursive(nextGroup, k);
 * 4. 返回当前组翻转后的新头节点。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(n)
 *   - 每个节点在探路时被访问一次，在翻转时被访问一次，总共访问常数 2 次，总体时间 O(n)。
 * 空间复杂度：
 *   - 迭代法：O(1)，仅使用有限常数个指针变量。
 *   - 递归法：O(n/k)，递归调用栈深度为组数 n/k。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 迭代解法（O(1) 空间最优解）
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
function reverseKGroup(head, k) {
  if (!head || k <= 1) return head;

  const dummy = new ListNode(0, head);
  let prev = dummy; // prev 始终指向待翻转组的前驱节点

  while (true) {
    // 1. 探路：检查从 prev 开始往后是否还有至少 k 个节点
    let tail = prev;
    for (let i = 0; i < k; i++) {
      tail = tail.next;
      if (!tail) return dummy.next; // 不足 k 个，保留原有顺序，直接返回
    }

    // 2. 记录关键节点位置
    const nextGroup = tail.next; // 下一组的起始节点
    const start = prev.next;     // 当前组翻转前的头节点（翻转后将变为尾节点）

    // 3. 原地翻转当前组 [start, tail]
    let p = nextGroup; // 翻转后尾巴要直连 nextGroup，所以初始前驱设为 nextGroup
    let curr = start;
    while (curr !== nextGroup) {
      const nxt = curr.next;
      curr.next = p;
      p = curr;
      curr = nxt;
    }

    // 4. 将前驱节点连向翻转后的新头节点 (tail)，并更新 prev 为下一组的前驱
    prev.next = tail;
    prev = start; // 原头节点 start 已经变成当前组的尾部
  }
}

/**
 * 延伸 1：递归分治实现
 *
 * 需求：每次只处理前 k 个节点，剩余链表递归处理；不足 k 个保持原样。
 *
 * 思路：
 * 1. 探出第 k 个节点后的边界 nextGroup。
 * 2. 反转 [head, nextGroup) 这 k 个节点。
 * 3. 让翻转后的尾部 (head) 递归接上下一组的处理结果。
 *
 * 复杂度：时间 O(n)，空间 O(n/k) 递归调用栈。
 *
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
function reverseKGroupRecursive(head, k) {
  if (k <= 1 || !head) return head;

  // 1. 探路检查是否有 k 个节点
  let nextGroup = head;
  for (let i = 0; i < k; i++) {
    if (!nextGroup) return head; // 不足 k 个不翻转
    nextGroup = nextGroup.next;
  }

  // 2. 翻转前 k 个节点
  let prev = nextGroup;
  let curr = head;
  for (let i = 0; i < k; i++) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // 3. 原 head 此时成为尾巴，递归连接后续组
  head.next = reverseKGroupRecursive(nextGroup, k);

  return prev; // prev 为当前组翻转后的新头节点
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
 * Q1: 为什么翻转每一组前必须要先向后数 k 个？
 * A1: 题目要求“不足 k 个的节点保持原有顺序”。如果不先探路就直接翻，遇到链表尾部不足 k 个时就必须再反向翻转一次进行回滚，逻辑会变得非常繁琐。
 *
 * Q2: 翻转完一组后，prev 指针应该挪到哪里？
 * A2: 翻转前这一组的头节点（start），在翻转后会变成这组的尾节点（newTail）。下一组的前驱就是这个 newTail，因此必须更新 prev = start。
 *
 * Q3: 与 LeetCode 24（两两交换链表节点）的关系？
 * A3: 本题是 LC 24 的通用泛化版本（LC 24 相当于 k = 2 的特例）。
 */

// —— 自测 ——
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 2))); // [2, 1, 4, 3, 5]
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 3))); // [3, 2, 1, 4, 5]
console.log(toArray(reverseKGroup(build([1, 2, 3, 4, 5]), 1))); // [1, 2, 3, 4, 5]
console.log(toArray(reverseKGroup(build([1]), 2)));             // [1]

// —— 递归版本自测 ——
console.log(toArray(reverseKGroupRecursive(build([1, 2, 3, 4, 5]), 2))); // [2, 1, 4, 3, 5]
console.log(toArray(reverseKGroupRecursive(build([1, 2, 3, 4, 5]), 3))); // [3, 2, 1, 4, 5]

module.exports = { ListNode, reverseKGroup, reverseKGroupRecursive, build, toArray };
