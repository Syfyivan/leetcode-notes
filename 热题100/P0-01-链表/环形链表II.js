/**
 * 热题 100 · 环形链表II
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 环形链表 II（LeetCode 142 · 中等）
 *
 * 【题目描述】
 * 给定一个链表的头节点 head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
 * 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
 * 不允许修改 链表。
 *
 * 进阶：是否可以使用 O(1) 空间解决此题？
 *
 * ——— 解法一：Floyd 双指针相遇 + 双路同速汇合（推荐，O(1) 空间） ———
 *
 * 【核心数学推导（面试必问）】
 * 设各段距离定义如下：
 *   - 从链表头节点 (head) 到入环节点 (entrance) 的距离为：a
 *   - 从入环节点 (entrance) 到快慢指针首次相遇点 (meet) 的顺时针距离为：b
 *   - 从相遇点 (meet) 顺时针继续走到入环节点 (entrance) 的剩余距离为：c
 *   - 环的总周长 L = b + c
 *
 * ┌────────── a ──────────┐┌───────── b ─────────┐
 * head ──────────────────> entrance ────────────> meet ──┐
 *                            ▲                          │
 *                            └────────── c ─────────────┘
 *
 * 1. 计算两指针相遇时的总路程：
 *    - 慢指针 slow 走过的路程：S_slow = a + b
 *    - 快指针 fast 走过的路程：S_fast = a + n·L + b（其中 n >= 1 为 fast 在环内转过的圈数）
 *
 * 2. 根据速度关系（fast 速度是 slow 的 2 倍）：
 *    S_fast = 2 · S_slow
 *    a + n·L + b = 2(a + b)
 *    a + n·L + b = 2a + 2b
 *    a = n·L - b
 *    a = (n - 1)·L + (L - b)
 *    由于 L = b + c，即 L - b = c，因此得出决定性公式：
 *    【 a = (n - 1)·L + c 】
 *
 * 3. 物理含义解读：
 *    “从链表头 head 出发走到入环点（距离 a）”，在步数上完全等价于：
 *    “从相遇点 meet 出发绕环转 (n - 1) 圈后，再走距离 c 到达入环点”！
 *
 * 4. 算法执行步骤：
 *    - 第一阶段：fast 走 2 步，slow 走 1 步，直到二者首次相遇；若 fast 到达 null 则无环返回 null。
 *    - 第二阶段：让一个指针 p 从 head 出发，slow 留在相遇点。二者每次都只走 1 步。
 *    - 当 p 与 slow 再次相遇时，当前相遇的节点就是【入环点】！
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(n)
 *   - 第一阶段找相遇点耗时 <= n；
 *   - 第二阶段同步走 a 步耗时 <= n；
 *   - 总时间复杂度严格为 O(n)。
 * 空间复杂度：O(1)，仅使用常数个辅助指针。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 快慢指针找入环点（O(1) 空间最优解）
 * @param {ListNode} head
 * @return {ListNode|null}
 */
function detectCycle(head) {
  let slow = head;
  let fast = head;

  // 第一阶段：寻找相遇点
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // 第二阶段：一指针从 head 起步，一指针从相遇点起步，同速前进
      let p = head;
      while (p !== slow) {
        p = p.next;
        slow = slow.next;
      }
      return p; // 二者再次相遇处即为入环节点
    }
  }

  return null; // 无环
}

/**
 * 延伸 1：哈希表找入环点（空间换时间）
 *
 * 思路：遍历链表并将访问过的节点存入 Set 中，第一次在 Set 中查到的重复节点即为入环点。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 *
 * @param {ListNode} head
 * @return {ListNode|null}
 */
function detectCycleWithSet(head) {
  const visited = new Set();
  let cur = head;
  while (cur) {
    if (visited.has(cur)) return cur;
    visited.add(cur);
    cur = cur.next;
  }
  return null;
}

// —— 小工具：建链表并让尾节点指向索引 pos 的节点造环；pos = -1 表示无环 ——
function buildWithCycle(arr, pos) {
  const nodes = arr.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0] || null;
}

/**
 * ——— 常见面试追问 ———
 * Q1: slow 在进入环后的第一圈内必定会被 fast 追上吗？
 * A1: 必定会在第一圈内被追上。因为当 slow 刚踏入入环点时，fast 已经在环内某个位置；fast 距离 slow 的最大距离不会超过环长 L，而 fast 相对 slow 的追及速度是 1 步/轮，因此在 slow 走完一圈（L 步）之前，fast 必定已经追上 slow。
 *
 * Q2: 如果入环节点就是 head（例如整个链表是一个大圆环，a = 0），代码能正常处理吗？
 * A2: 可以。当 a = 0 时，首次相遇点就在 head 处。第二阶段中 `let p = head` 且 `slow = head`，`while (p !== slow)` 条件直接为 false，循环不进，直接返回 head，完全符合逻辑。
 */

// —— 自测 ——
const case1 = buildWithCycle([3, 2, 0, -4], 1);
console.log(detectCycle(case1)?.val ?? null); // 期望： 2 (入环点值是 2)

const case2 = buildWithCycle([1, 2], 0);
console.log(detectCycle(case2)?.val ?? null); // 期望： 1 (入环点值是 1)

const case3 = buildWithCycle([1], -1);
console.log(detectCycle(case3));             // 期望： null (无环)

// —— 哈希表自测 ——
console.log(detectCycleWithSet(case1)?.val ?? null); // 期望： 2

module.exports = { ListNode, detectCycle, detectCycleWithSet, buildWithCycle };
