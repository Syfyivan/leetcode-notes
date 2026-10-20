/**
 * 热题 100 · 两两交换链表中的节点
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 两两交换链表中的节点（LeetCode 24 · 中等）
 *
 * 【题目描述】
 * 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。
 * 你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
 *
 * ——— 解法一：迭代法（推荐，O(1) 空间） ———
 * 【核心思路】
 * 1. 哨兵节点 dummy：
 *    由于原头节点会被第 2 个节点替代，引入 dummy(0, head) 便于统一处理头节点交换。
 * 2. 状态指针定义：
 *    - prev：指向当前待交换两节点的前驱节点（初始指向 dummy）。
 *    - node1 = prev.next：当前待交换的第 1 个节点。
 *    - node2 = prev.next.next：当前待交换的第 2 个节点。
 * 3. 交换三部曲（必须严格保证顺序，防止断链）：
 *    ① prev.next = node2;       // 前驱接上新头 (node2)
 *    ② node1.next = node2.next; // node1 接上下一对的开头（缝合后半截）
 *    ③ node2.next = node1;      // node2 调头指向 node1（完成内部交换）
 * 4. 前进指针：
 *    prev 移动到 node1（因为 node1 已经变成了这一对的尾巴，成为下一对的前驱）。
 *
 * ——— 图解指针变换过程 ———
 * 初始状态：
 *   prev -> node1(1) -> node2(2) -> [3 -> 4]
 *
 * ① prev.next = node2 (让 prev 指向 2):
 *   prev ────> node2(2) ──> 3
 *   node1(1) ──┘
 *
 * ② node1.next = node2.next (让 1 指向 3):
 *   prev ────> node2(2)
 *   node1(1) ───────────> 3
 *
 * ③ node2.next = node1 (让 2 指回 1):
 *   prev ──> node2(2) ──> node1(1) ──> 3
 *
 * ④ prev 前进到 node1:
 *                          prev ──> [3 -> 4]
 *
 * ——— 解法二：递归回溯法 ———
 * 【核心思路】
 * 1. 终止条件：若 head 为空或仅剩单节点 head.next 为空，无需交换，直接返回 head。
 * 2. 局部交换与递归：
 *    - 设 first = head, second = head.next。
 *    - 先递归交换后面的链表：first.next = swapPairsRecursive(second.next);
 *    - 再让 second.next 指回 first 完成调头：second.next = first;
 *    - 返回 second 作为当前子链表的新头节点。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(n)，每个节点被访问一次。
 * 空间复杂度：
 *   - 迭代法：O(1)，仅需常数个辅助指针。
 *   - 递归法：O(n/2) = O(n)，递归调用栈深度为 n/2。
 */

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 迭代解法（双指针 / 三指针）
 * @param {ListNode} head
 * @return {ListNode}
 */
function swapPairs(head) {
  // 1. 虚拟头节点，避免特判头节点的变动
  const dummy = new ListNode(0, head);
  let prev = dummy;

  // 2. 只要后面还有至少两个节点，就继续两两交换
  while (prev.next && prev.next.next) {
    const node1 = prev.next;
    const node2 = node1.next;

    // 3. 执行指针重连三部曲
    prev.next = node2;         // 前驱指向第 2 个节点
    node1.next = node2.next;   // 第 1 个节点接上后续链表
    node2.next = node1;        // 第 2 个节点指回第 1 个节点

    // 4. prev 移动到原 node1（现在的尾节点），准备下一轮交换
    prev = node1;
  }

  return dummy.next;
}

/**
 * 延伸 1：递归交换
 *
 * 需求：每次只交换链表开头两个节点，后面的部分交给递归。
 *
 * 思路：
 * 1. 递归基底：空链表或单节点直接返回。
 * 2. 提取当前一对中的 first 和 second。
 * 3. first.next 接收后续递归处理好的子链表头。
 * 4. second.next 指向 first。
 * 5. 返回 second。
 *
 * 复杂度：时间 O(n)，空间 O(n) 递归栈。
 *
 * @param {ListNode} head
 * @return {ListNode}
 */
function swapPairsRecursive(head) {
  if (!head || !head.next) return head;

  const first = head;
  const second = head.next;

  // 递归处理后续节点，并拼接到 first 后面
  first.next = swapPairsRecursive(second.next);
  // 当前两个节点完成反转
  second.next = first;

  return second;
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
 * Q1: 为什么不能直接交换节点内部的 val（值传递）？
 * A1: 很多面试官和 LeetCode 题目明确禁止修改 val。因为在实际工程中，链表节点内部可能封装了庞大的业务数据、不可变属性或被外部对象引用，交换节点引用才是真正通用的做法。
 *
 * Q2: 迭代循环中如果链表长度是奇数怎么办？
 * A2: while 条件为 `while (prev.next && prev.next.next)`。当链表剩最后一个孤立节点时，`prev.next.next` 为 null，循环安全退出，末尾节点自动保持原样。
 *
 * Q3: 三步交换的赋值顺序能不能改动？
 * A3: 可以有等价写法，但必须保证在改变 `node2.next` 之前，把 `node2.next` 的值（即后半段链表）保存或直接赋给 `node1.next`，否则后半段链表就会丢失。
 */

// —— 自测 ——
console.log(toArray(swapPairs(build([1, 2, 3, 4]))));     // 期望： [2, 1, 4, 3]
console.log(toArray(swapPairs(build([1, 2, 3, 4, 5]))));  // 期望： [2, 1, 4, 3, 5]（奇数个节点）
console.log(toArray(swapPairs(build([1]))));              // 期望： [1]
console.log(toArray(swapPairs(build([]))));               // 期望： []

// —— 递归版自测 ——
console.log(toArray(swapPairsRecursive(build([1, 2, 3, 4]))));    // 期望： [2, 1, 4, 3]
console.log(toArray(swapPairsRecursive(build([1, 2, 3, 4, 5])))); // 期望： [2, 1, 4, 3, 5]

module.exports = { ListNode, build, toArray, swapPairs, swapPairsRecursive };
