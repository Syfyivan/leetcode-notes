/**
 * 热题 100 · 环形链表II
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 环形链表 II（LeetCode 142）
 *
 * 给定一个链表的头节点 head，返回链表开始入环的第一个节点。
 * 如果链表无环，则返回 null。
 * 为了表示给定链表中的环，用整数 pos 表示链表尾连接到链表中的位置（索引从 0 开始）；
 * 如果 pos 是 -1，则该链表中没有环。注意：pos 不作为参数传递，仅用于说明链表结构。
 *
 * 进阶：能否只用常量额外空间完成？
 *
 * 思路：
 * 1. 找环的入口节点，无环返回 null。
 * 2. Floyd 相遇后，一个指针回到头，两个再各走 1 步，再次相遇就是入口。
 * 3. 空链表或无环返回 null。
 * 复杂度：时间 O(n)，空间 O(1)
 *
 * ——— 示例 ———
 * 输入： head = [3,2,0,-4], pos = 1
 * 输出： 返回索引为 1 的节点（值为 2）
 *
 * 输入： head = [1,2], pos = 0
 * 输出： 返回索引为 0 的节点（值为 1）
 *
 * 输入： head = [1], pos = -1
 * 输出： null
 *
 * ——— 延伸 ———
 * - 只判有没有环就是 LC141，相遇即可，不用找入口。
 * - 头到入口 a、环长 c、相遇时慢走了 a+x：2(a+x)=a+x+kc → a=kc-x，
 *   所以从头和从相遇点再走，会在入口碰上。
 * - 哈希记下第一次重复的节点，就是入口。
 *
 * ——— 常见追问 ———
 * Q: 为什么相遇后一个要回到头？
 * A: 慢指针在环里已经走了 x。从头再走 a 步，刚好等于从相遇点走到入口。
 *
 * Q: 入口就是头怎么办？
 * A: p 和 slow 一开始就相等，while 不进，直接返回头。
 *
 * Q: 无环？
 * A: fast 走到空，循环结束返回 null。
 *
 * Q: 空间？
 * A: 几个指针 O(1)。哈希 O(n)。
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
 * @param {ListNode} head
 * @return {ListNode}
 */
function detectCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let p = head; // 一个放回头，两个再各走 1
      while (p !== slow) { // 头到入口 = 相遇点到入口
        p = p.next;
        slow = slow.next;
      }
      return p;
    }
  }
  return null;
}

/**
 * 延伸 1：哈希表找环入口
 *
 * 需求：用更直观的方法返回第一次重复访问的节点；无环返回 null。
 *
 * 思路：沿 next 前进并把节点引用放入 Set，再次命中的节点就是环入口。
 *
 * ——— 示例 ———
 * 示例：3→2→0→-4，尾节点连回 2，返回值为 2 的节点。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function detectCycleWithSet(head) {
  const seen = new Set();
  for (let node = head; node; node = node.next) {
    if (seen.has(node)) return node;
    seen.add(node);
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

// —— 自测（返回节点可能在环内，勿用 toArray 打印，判断 val 或 null 即可）——
console.log(detectCycle(buildWithCycle([3, 2, 0, -4], 1))?.val ?? null); // 期望： 2
console.log(detectCycle(buildWithCycle([1, 2], 0))?.val ?? null);        // 期望： 1
console.log(detectCycle(buildWithCycle([1], -1)));                       // 期望： null

module.exports = { ListNode, build, toArray, detectCycle, detectCycleWithSet, buildWithCycle };
