/**
 * 热题 100 · 回文链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 回文链表（LeetCode 234 · 简单）
 *
 * 【题目描述】
 * 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
 * 进阶：你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？
 *
 * ——— 解法一：快慢指针找中点 + 反转后半部分（推荐，O(1) 空间） ———
 * 【核心思维模型】
 * 回文链表的特征是“前半段正序”与“后半段逆序”的节点值完全对称。
 *
 * 1. 定位前半段的末尾（快慢指针法）：
 *    - 初始化 slow = head, fast = head。
 *    - 循环条件：`while (fast.next && fast.next.next)`（每次 fast 走 2 步，slow 走 1 步）。
 *    - 停止位置：
 *      - 偶数节点（如 1->2->2->1）：slow 停在第一个 2（前半段的末尾）；
 *      - 奇数节点（如 1->2->3->2->1）：slow 停在 3（正中间节点）。
 *
 * 2. 反转后半段链表：
 *    - 从 `slow.next` 开始反转链表（无论奇偶，反转的都是中点之后的严格后半段）。
 *    - 反转后得到后半段的新头节点 `p2`。
 *
 * 3. 前后双指针比对：
 *    - p1 从 head 出发，p2 从后半段新头出发。
 *    - 只要 p2 不为 null，逐个比较 `p1.val === p2.val`。
 *    - 若发现不相等直接返回 false；比对全部通过则为回文。
 *
 * 4. （工程加分项）还原链表：
 *    - 比较完毕后，可再次反转后半段并接回 `slow.next`，恢复原始链表结构，保持纯函数无副作用。
 *
 * ——— 图解中点与反转过程 ———
 * 以偶数链表 1 -> 2 -> 2 -> 1 为例：
 * 找中点：
 *   1 -> 2 -> 2 -> 1
 *        ↑    ↑
 *      slow  fast
 *
 * 反转后半段（从 slow.next 即第 2 个 2 开始翻转）：
 *   前半段: 1 -> 2
 *   后半段: 1 -> 2 （原 2 -> 1 翻转为 1 -> 2）
 *   p1 从 1 开始，p2 从 1 开始逐位比较，完全相等！
 *
 * ——— 解法二：数组双指针法（空间 O(n) 简单基准） ———
 * 将链表节点值全部复制到数组中，利用左右双指针 `left` 和 `right` 向中间逼近比对。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(n)
 *   - 快慢指针找中点：遍历 n/2 步；
 *   - 反转后半段：遍历 n/2 步；
 *   - 双指针比对：遍历 n/2 步；
 *   - 总时间为 1.5n = O(n)。
 * 空间复杂度：
 *   - 解法一：O(1)，原地指针反转，仅使用常数个辅助指针。
 *   - 解法二：O(n)，需要开辟长度为 n 的数组。
 */

// —— 链表节点定义（模板，别改）——
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 快慢指针 + 反转后半段（O(1) 空间最优解）
 * @param {ListNode} head
 * @return {boolean}
 */
function isPalindrome(head) {
  if (!head || !head.next) return true;

  // 1. 快慢双指针寻找前半段的末尾
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. 原地反转后半段链表（从 slow.next 开始）
  let prev = null;
  let curr = slow.next;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // 3. 对比前半段与反转后的后半段
  let p1 = head;
  let p2 = prev; // p2 是反转后后半段的新头节点
  let isPalin = true;

  while (p2) {
    if (p1.val !== p2.val) {
      isPalin = false;
      break;
    }
    p1 = p1.next;
    p2 = p2.next;
  }

  // 4. （可选但推荐）恢复链表原始结构
  let restorePrev = null;
  let restoreCurr = prev;
  while (restoreCurr) {
    const next = restoreCurr.next;
    restoreCurr.next = restorePrev;
    restorePrev = restoreCurr;
    restoreCurr = next;
  }
  slow.next = restorePrev;

  return isPalin;
}

/**
 * 延伸 1：数组双指针法
 *
 * 需求：使用最稳妥直观的方式进行回文校验。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 *
 * @param {ListNode} head
 * @return {boolean}
 */
function isPalindromeWithArray(head) {
  const values = [];
  for (let node = head; node; node = node.next) values.push(node.val);

  let left = 0;
  let right = values.length - 1;
  while (left < right) {
    if (values[left] !== values[right]) return false;
    left++;
    right--;
  }
  return true;
}

// —— 小工具：数组建链表 ——
function build(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

/**
 * ——— 常见面试追问 ———
 * Q1: 为什么快慢指针循环条件要写 `while (fast.next && fast.next.next)` 而不是 `while (fast && fast.next)`？
 * A1: 使用 `fast.next && fast.next.next` 能确保对于偶数长度链表（如 4 个节点），slow 停留在第 2 个节点（前半段的末尾），方便直接以 `slow.next` 作为后半段的切分点；如果用 `fast && fast.next`，slow 会走到第 3 个节点，切分位置会偏后。
 *
 * Q2: 为什么选择反转后半段而不是反转前半段？
 * A2: 如果反转前半段，原链表的 head 节点指针会被改写，在没有额外保存的情况下会破坏前半段的遍历入口；反转后半段可以完美保留原 head，从两头向中间靠拢比对。
 *
 * Q3: 原地修改链表在并发环境下有什么隐患？
 * A3: 在多线程或并发异步读取链表的场景下，原地反转会导致其他正在读取该链表的线程读到错误的数据或发生死循环（临时破坏了链表方向）。因此工程中如果要求线程安全且不可变，通常倾向于复制到数组或使用读写锁。
 */

// —— 自测 ——
console.log(isPalindrome(build([1, 2, 2, 1])));    // true (偶数长度回文)
console.log(isPalindrome(build([1, 2, 3, 2, 1]))); // true (奇数长度回文)
console.log(isPalindrome(build([1, 2])));          // false (非回文)
console.log(isPalindrome(build([1])));             // true (单节点)
console.log(isPalindrome(build([])));              // true (空链表)
console.log(isPalindrome(build([1, 2, 3, 1])));    // false

// —— 数组版自测 ——
console.log(isPalindromeWithArray(build([1, 2, 2, 1]))); // true
console.log(isPalindromeWithArray(build([1, 2, 3])));    // false

module.exports = { ListNode, isPalindrome, isPalindromeWithArray, build };
