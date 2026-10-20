/**
 * 热题 100 · 反转链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 反转链表（LeetCode 206）
 *
 * 【题目描述】
 * 给你单链表的头节点 head，请你反转链表，并返回反转后的链表头节点。
 *
 * ——— 解法一：迭代双指针法（推荐，空间最优） ———
 * 【核心思路】
 * 遍历链表，逐个改变节点的指向，让当前节点的 next 改指前驱节点 prev。
 * 1. 初始化双指针：prev = null, curr = head。
 * 2. 循环遍历：
 *    - 暂存后继：next = curr.next（防止断链后找不到后面的一串节点）
 *    - 改变指向：curr.next = prev（反转核心：让当前节点指回前一个节点）
 *    - 双指针后移：prev = curr, curr = next
 * 3. 循环结束时，curr 指向 null，prev 恰好停在原链表的尾节点（即反转后的新头节点），直接返回 prev。
 *
 * ——— 解法二：递归回溯法（理解调用栈与树形分治基础） ———
 * 【核心思路】
 * 1. 递归终止条件（Base Case）：如果 head 为空或只有一个节点 head.next === null，直接返回 head。
 * 2. 递进深入：const newHead = reverseList(head.next); 一路递归到链表最后一个节点，该节点就是最终的新头节点 newHead。
 * 3. 回溯操作（调转指针）：
 *    - head.next.next = head; （让当前节点的后继节点指回自己）
 *    - head.next = null; （切断原本的正向指向，防止原头节点成环）
 * 4. 返回 newHead。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(n)，两种方法都需要遍历整个链表的每个节点恰好一次。
 * 空间复杂度：
 *   - 迭代法：O(1)，仅使用常数个辅助指针变量。
 *   - 递归法：O(n)，函数调用栈的深度等于链表长度 n。
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
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 递归法
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // 1. 递归终止条件：空链表或只剩最后一个节点时触底返回
  if (!head || !head.next) return head;

  // 2. 递进：先递归反转后半部分，newHead 最终是原链表的最后一个节点
  const newHead = reverseList(head.next);

  // 3. 回溯：让下一个节点 (head.next) 的 next 指回当前节点 head
  head.next.next = head;

  // 4. 切断当前节点正向指向，防止头尾成环
  head.next = null;

  return newHead;
}

/**
 * 迭代法（双指针法）
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseListIterative(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next; // 1. 暂存后续节点，防止断链
    curr.next = prev;       // 2. 调转指针，当前节点指向前驱
    prev = curr;            // 3. 前驱指针右移
    curr = next;            // 4. 当前指针右移
  }

  return prev; // curr 停在 null 时，prev 刚好停在反转后的新头节点
}

/**
 * 延伸 1：反转指定区间（LeetCode 92 · 反转链表 II）
 *
 * 【需求】
 * 给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。
 * 请你反转从位置 left 到位置 right 的链表节点，返回反转后的链表。其余节点顺序保持不变。
 *
 * 【核心思路：头插法（One Pass 单次遍历，O(1) 额外空间）】
 *
 * 1. 哨兵节点 dummy：
 *    创建 dummy(0, head)，应对 left = 1（头节点被反转）的边界情况。
 *
 * 2. 核心指针角色划分：
 *    - before：反转区间的前驱节点（停在 left - 1 位置），在整个区间反转过程中【固定不动】。
 *    - tail：反转区间的第一个节点（原第 left 个节点）。
 *            随着后面的节点不断被头插到 before 之后，tail 会被一步步往后挤，
 *            最终成为反转后区间的【尾节点】（tail 变量始终锁定在同一个节点对象上）。
 *    - moved：当前这一轮准备抽出来并插到区间的开头的节点（每次等于 tail.next）。
 *
 * 3. 头插法 4 步指针变换（以 1 -> 2 -> 3 -> 4 -> 5，left=2, right=4 为例）：
 *    初始状态：before(1) -> tail(2) -> moved(3) -> 4 -> 5
 *
 *    每轮循环执行以下 4 步：
 *    ① const moved = tail.next;   // 锁定待移动节点 (节点 3)
 *    ② tail.next = moved.next;     // 拔出 moved，tail 直连 moved 的后继 (2 -> 4)
 *    ③ moved.next = before.next;   // 将 moved 指向当前反转区间的头部 (3 -> 2)
 *    ④ before.next = moved;        // 将 before 接上 moved，完成插入 (1 -> 3)
 *
 *    第 1 轮后：1 -> 3 -> 2(tail) -> 4 -> 5
 *    第 2 轮后：1 -> 4 -> 3 -> 2(tail) -> 5  (反转完成！)
 *
 * 复杂度：时间 O(n)，空间 O(1)。
 *
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
function reverseBetween(head, left, right) {
  if (!head || left === right) return head;

  // 1. 引入虚拟头节点，统一 left=1 的边界处理
  const dummy = new ListNode(0, head);
  let before = dummy;

  // 2. 将 before 移动到待反转区间的前一位（left - 1 的位置）
  for (let i = 1; i < left; i++) {
    before = before.next;
  }

  // 3. tail 指向区间的第一个节点（即原第 left 个节点）
  const tail = before.next;

  // 4. 区间内需要翻转 right - left 次，每次将 tail.next 节点抽出并头插到 before 后面
  for (let i = 0; i < right - left; i++) {
    const moved = tail.next;     // 抓出待移动节点
    tail.next = moved.next;     // 缝合后半段断链
    moved.next = before.next;   // moved 指向当前区间的最前端
    before.next = moved;        // before 指向新的区间前端
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

/**
 * ——— 常见面试追问 ———
 * Q1: 递归法中为什么必须写 head.next = null？
 * A1: 递归回溯时，原链表中的头节点（节点 1）它的 next 原本指向节点 2；回溯让 2 指向 1 之后，如果 1 不切断指向 null，就会在 1 和 2 之间形成双向循环死链（环形链表）。
 *
 * Q2: head.next.next = head 这行代码到底是什么意思？
 * A2: 假设当前 head 是 4，head.next 是 5。那么 head.next.next 实际上就是 (节点5).next。赋值为 head 意味着让 5 的 next 指回 4，完成指针翻转。
 *
 * Q3: 迭代法中为什么要先暂存 const next = curr.next？
 * A3: 因为执行 curr.next = prev 会立刻改写 curr 的 next 指针。如果不提前保存后继节点，链表后半段就会丢失在内存中无法继续遍历。
 *
 * Q4: 为什么工业界/工程上反转链表几乎只用迭代？
 * A4: 递归法需要消耗 O(n) 的调用栈空间。在链表长度较大（如几万甚至数十万）时，递归会直接触发调用栈溢出（Stack Overflow Crash），而迭代法是 O(1) 常数空间，安全稳定。
 */

// —— 自测 ——
console.log(toArray(reverseList(build([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(toArray(reverseList(build([1, 2]))));          // [2, 1]
console.log(toArray(reverseList(build([]))));              // []

// —— 迭代版自测 ——
console.log(toArray(reverseListIterative(build([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(toArray(reverseListIterative(build([1, 2]))));          // [2, 1]
console.log(toArray(reverseListIterative(build([]))));              // []

// —— 区间反转自测（LeetCode 92） ——
console.log(toArray(reverseBetween(build([1, 2, 3, 4, 5]), 2, 4))); // [1, 4, 3, 2, 5]
console.log(toArray(reverseBetween(build([5]), 1, 1)));             // [5]
console.log(toArray(reverseBetween(build([3, 5]), 1, 2)));          // [5, 3]

module.exports = { ListNode, reverseList, reverseListIterative, reverseBetween, build, toArray };
