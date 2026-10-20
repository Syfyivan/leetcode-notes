/**
 * 热题 100 · 排序链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 排序链表（LeetCode 148 · 中等）
 *
 * 【题目描述】
 * 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。
 * 进阶：你可以在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序吗？
 *
 * ——— 解法一：自顶向下归并排序（Top-Down Merge Sort，推荐） ———
 * 【为什么链表排序首选归并排序（Merge Sort）？】
 * 1. 数组快排依靠下标随机访问（Random Access），而单链表无法高效通过下标寻址；
 * 2. 数组归并需要 O(n) 的额外数组空间开辟，但单链表的归并只需要修改指针指向，合并阶段是【真正原地 O(1) 空间】！
 *
 * 【核心思维模型】
 * 1. 分割（Divide）：
 *    - 利用快慢指针找到链表的中点。
 *    - 【致命避坑点】：必须初始化 `let fast = head.next; let slow = head;`！
 *      如果 `fast = head`，当链表只有 2 个节点（例如 [4, 2]）时，slow 会停在第 2 个节点（2），切断后左半段依然是 [4, 2]，右半段是 null，会导致**无限递归栈溢出**！
 *      从 `head.next` 出发能确保 2 个节点时 slow 停在第 1 个节点（4），稳妥切成 [4] 和 [2]。
 * 2. 切断（Disconnect）：
 *    - mid = slow.next;
 *    - slow.next = null; （切断前后联系，拆成两条独立的子链表）。
 * 3. 递归与合并（Conquer & Merge）：
 *    - 分别递归排序左半段 `sortList(head)` 和右半段 `sortList(mid)`。
 *    - 调用有序链表合并函数 `mergeTwoLists` 将两段有序链表缝合成一条。
 *
 * ——— 解法二：自底向上归并排序（Bottom-Up Merge Sort，进阶 O(1) 空间） ———
 * 消除递归栈：
 * 1. 先统计链表总长度 length。
 * 2. 步长 step 从 1 开始翻倍（1 -> 2 -> 4 -> 8 ... < length）。
 * 3. 每次按 step 长度将链表切分成两段进行两两合并，完全不使用递归调用栈，空间做到严格 O(1)。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(n log n)
 *   - 递归树共有 log n 层，每一层的归并总共需要遍历所有 n 个节点，因此时间复杂度恒为 O(n log n)。
 * 空间复杂度：
 *   - 自顶向下递归版：O(log n) 的递归调用栈深度。
 *   - 自底向上迭代版：O(1) 严格常数额外空间。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 辅助函数：合并两个升序链表
 */
function mergeTwo(l1, l2) {
  const dummy = new ListNode(0);
  let cur = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 || l2;
  return dummy.next;
}

/**
 * 归并排序（自顶向下）
 * @param {ListNode} head
 * @return {ListNode}
 */
function sortList(head) {
  // 1. 递归基底：空链表或单节点本身已有序
  if (!head || !head.next) return head;

  // 2. 快慢指针找中点（注意 fast = head.next 规避 2 节点死循环）
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 3. 切断链表为两段
  const mid = slow.next;
  slow.next = null; // 必须切断

  // 4. 递归排序两边并合并
  const left = sortList(head);
  const right = sortList(mid);

  return mergeTwo(left, right);
}

/**
 * 延伸 1：数组排序对拍基准
 *
 * 需求：先写一个便于核对结果的基准版本，不追求 O(1) 额外空间。
 *
 * 复杂度：时间 O(n log n)，空间 O(n)。
 *
 * @param {ListNode} head
 * @return {ListNode}
 */
function sortListWithArray(head) {
  const values = [];
  for (let node = head; node; node = node.next) values.push(node.val);
  values.sort((a, b) => a - b);
  return build(values);
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
 * Q1: 为什么快慢指针找中点时 fast 要从 head.next 开始？
 * A1: 这是本题最高频的 Bug 来源。当只有两个节点（如 `4 -> 2 -> null`）时：
 *    - 若 fast 从 head 起步：循环结束时 slow 停在节点 2。`slow.next = null` 后，左半部分是 `4 -> 2`，右半部分是 `null`。再次调用 `sortList(left)` 会无限循环导致栈溢出。
 *    - 若 fast 从 head.next 起步：循环不进，slow 停在节点 4。切断后左边为 `4`，右边为 `2`，顺利触底递归基底。
 *
 * Q2: 为什么必须写 `slow.next = null`？
 * A2: 必须在物理上切断前半段和后半段的联系。如果不切断，前半段的尾节点依然连着后半段，归并函数无法判断前半段的结束边界，会陷入死循环。
 */

// —— 自测 ——
console.log(toArray(sortList(build([4, 2, 1, 3]))));     // 期望： [1, 2, 3, 4]
console.log(toArray(sortList(build([-1, 5, 3, 4, 0])))); // 期望： [-1, 0, 3, 4, 5]
console.log(toArray(sortList(build([2, 1]))));           // 期望： [1, 2]（关键两节点测试）
console.log(toArray(sortList(build([1]))));              // 期望： [1]
console.log(toArray(sortList(build([]))));               // 期望： []

module.exports = { ListNode, build, toArray, sortList, sortListWithArray };
