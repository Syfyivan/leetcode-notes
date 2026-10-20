/**
 * 热题 100 · 环形链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 环形链表（LeetCode 141 · 简单）
 *
 * 【题目描述】
 * 给你一个链表的头节点 head ，判断链表中是否有环。
 * 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
 * 如果链表中存在环 ，则返回 true 。 否则，返回 false 。
 *
 * 进阶：你能用 O(1)（即，常量）内存解决此问题吗？
 *
 * ——— 解法一：Floyd 判圈算法（快慢指针法，推荐 O(1) 空间） ———
 * 【核心思维模型】
 * 经典操场跑步“套圈”原理：
 * 1. 指针初始化：
 *    - slow = head（每次走 1 步，龟）
 *    - fast = head（每次走 2 步，兔）
 * 2. 追及相遇定理（为什么一定能相遇且不会跳过？）：
 *    - 若无环：fast 会率先到达链表末尾（fast === null 或 fast.next === null），返回 false；
 *    - 若有环：fast 和 slow 都会先后进入环中。
 *      在环内，以 slow 为参考系，fast 每次相对于 slow 前进 (2 - 1) = 1 步。
 *      由于相对速度恰好为 1，fast 会在环内一格一格缩短与 slow 的距离，绝对不会发生“直接跳过”的情况，二者【必然相遇】。
 * 3. 循环条件：
 *    `while (fast && fast.next)`，当 `slow === fast` 时即判定有环，返回 true。
 *
 * ——— 复杂度深度分析 ———
 * 时间复杂度：O(n)
 *   - 无环情况：fast 走 n/2 步到达末尾，耗时 O(n)。
 *   - 有环情况：
 *     ① 进入环前：两指针最多走非环部分长度 L1 步；
 *     ② 进入环后：fast 追上 slow 旋转距离最多为环长 L2。
 *     总步数 L1 + L2 = n，时间复杂度严格为 O(n)。
 * 空间复杂度：O(1)，仅使用 fast 和 slow 两个指针。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 快慢指针判环（O(1) 空间）
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
  let slow = head;
  let fast = head;

  // fast 及其 next 必须非空才能走 2 步
  while (fast && fast.next) {
    slow = slow.next;       // 慢指针走 1 步
    fast = fast.next.next;  // 快指针走 2 步

    if (slow === fast) {
      return true;          // 两指针相遇，必定有环
    }
  }

  return false;             // 快指针遇到末尾 null，说明无环
}

/**
 * 延伸 1：测量环的长度（Cycle Length）
 *
 * 需求：如果链表有环，返回环内节点的总个数；若无环返回 0。
 *
 * 思路：
 * 1. 按照快慢指针找到相遇点。
 * 2. 固定 slow 节点，让 fast 从相遇点的下一个节点出发，每走一步计数器 length++。
 * 3. 当 fast 再次回到 slow 节点时，计数值即为环的周长。
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 *
 * @param {ListNode} head
 * @return {number}
 */
function cycleLength(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // 找到了相遇点，开始绕环一圈测长度
      let length = 1;
      let runner = slow.next;
      while (runner !== slow) {
        length++;
        runner = runner.next;
      }
      return length;
    }
  }

  return 0; // 无环
}

/**
 * 延伸 2：哈希集合判环（最直观但空间 O(n)）
 *
 * 思路：用 Set 记录访问过的每一个节点引用，首次遇到已存在的节点则有环。
 *
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycleWithSet(head) {
  const visited = new Set();
  let cur = head;
  while (cur) {
    if (visited.has(cur)) return true;
    visited.add(cur);
    cur = cur.next;
  }
  return false;
}

// —— 小工具：建链表并可选指定尾节点连接到第 pos 个节点（0 起）制造环；pos = -1 表示无环 ——
function buildWithCycle(arr, pos) {
  const nodes = arr.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0] || null;
}

/**
 * ——— 常见面试追问 ———
 * Q1: 为什么 fast 每次走 2 步，走 3 步或者 4 步可以吗？
 * A1: 走 2 步最稳妥高效。
 *    - 若 fast 每次走 2 步，相对速度为 2 - 1 = 1，距离每轮减少 1，必定收敛到 0（相遇）；
 *    - 若 fast 每次走 3 步，相对速度为 3 - 1 = 2，当环长为偶数且初始距离为奇数时，可能会在多轮甚至某些极端离散模型中产生步长越界或延迟相遇；2 步不仅必然相遇，且对链表节点访问次数最少。
 *
 * Q2: 为什么 `while` 条件必须是 `while (fast && fast.next)`？
 * A2: fast 每次需要走两步（`fast = fast.next.next`）。必须先确保当前节点 `fast` 存在，且它的下一个节点 `fast.next` 也存在，否则访问 `fast.next.next` 会抛出空指针异常（TypeError: Cannot read properties of null）。
 */

// —— 自测 ——
console.log(hasCycle(buildWithCycle([3, 2, 0, -4], 1))); // true（环连接到下标 1）
console.log(hasCycle(buildWithCycle([1, 2], 0)));        // true（环连接到下标 0）
console.log(hasCycle(buildWithCycle([1], -1)));          // false（无环单节点）
console.log(hasCycle(buildWithCycle([], -1)));           // false（空链表）

// —— 环长自测 ——
console.log(cycleLength(buildWithCycle([3, 2, 0, -4], 1))); // 3（节点 2->0->-4 共 3 个节点）
console.log(cycleLength(buildWithCycle([1, 2], 0)));        // 2（节点 1->2 共 2 个节点）
console.log(cycleLength(buildWithCycle([1, 2, 3], -1)));    // 0（无环）

module.exports = { ListNode, hasCycle, cycleLength, hasCycleWithSet, buildWithCycle };
