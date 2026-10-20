/**
 * 热题 100 · 两数相加
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 两数相加（LeetCode 2 · 中等）
 *
 * 【题目描述】
 * 给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，
 * 并且每个节点只能存储一位数字。
 * 请你将两个数相加，并以相同形式返回一个表示和的链表。
 * 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * ——— 解法：模拟加法竖式（双指针 + 进位 carry） ———
 * 【核心思维模型】
 * 1. 逆序存储的本质优势：
 *    链表头节点正好对应整数的最低位（个位），后继节点依次对应十位、百位……
 *    这与我们小学做竖式加法“从低位向高位逐位相加、满十进一”的顺序天然一致！
 * 2. 哨兵节点 dummy：
 *    由于相加后生成一个全新的链表，使用 dummy 节点作为新链表的前驱，免去初始化头节点的条件分支。
 * 3. 循环相加规则（while 条件：l1 || l2 || carry）：
 *    - 节点值补零：若其中一条链表较短已经走到末尾（为 null），对应位的值按 0 参与计算。
 *    - 局部和计算：sum = val1 + val2 + carry。
 *    - 新节点赋值：创建值为 sum % 10 的新节点挂在当前链表尾部。
 *    - 进位更新：carry = Math.floor(sum / 10)。
 * 4. 关键边界——最高位进位：
 *    循环条件中必须包含 `carry > 0`！例如 5 + 5 = 10，当 l1 和 l2 都走完后，carry 依然为 1，必须再额外追加一个值为 1 的最高位节点。
 *
 * ——— 复杂度分析 ———
 * 时间复杂度：O(max(m, n))，其中 m 和 n 分别是两条链表的节点数。遍历循环最多执行 max(m, n) + 1 次。
 * 空间复杂度：O(1)（若不计用于存放结果的新链表节点空间），算法内部仅占用常数个辅助变量。
 *
 * ——— 示例 ———
 * 输入： l1 = [2,4,3], l2 = [5,6,4]  （数学含义：342 + 465）
 * 输出： [7,0,8]                      （数学含义：807）
 *
 * 输入： l1 = [0], l2 = [0]
 * 输出： [0]
 *
 * 输入： l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
 * 输出： [8,9,9,9,0,0,0,1]
 */

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0); // 虚拟头节点
  let cur = dummy;
  let carry = 0; // 进位数

  // 只要还有未处理的节点或者还有进位，就继续生成新节点
  while (l1 || l2 || carry) {
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;
    const sum = val1 + val2 + carry;

    carry = Math.floor(sum / 10);     // 计算进位（0 或 1）
    cur.next = new ListNode(sum % 10); // 创建当前位的个位节点
    cur = cur.next;

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return dummy.next;
}

/**
 * 延伸 1：两数相加 II · 正序存储（LeetCode 445）
 *
 * 【需求】
 * 链表最高位在链表开头（例如 7->2->4->3 表示 7243）。
 * 不能修改原链表结构（即不能反转输入链表），返回正序的结果链表。
 *
 * 【思路：双栈模拟 + 头插法构建】
 * 1. 遍历两条链表，分别将节点值压入两个栈 stack1 和 stack2 中。
 * 2. 此时栈顶即为最低位（个位），依次从两个栈顶弹出数字相加并累加进位 carry。
 * 3. 每次生成新节点时，利用“头插法”直接将新节点作为当前的 head（head = new ListNode(sum % 10, head)），自然生成正序链表。
 *
 * 复杂度：时间 O(m + n)，空间 O(m + n) 两个栈的辅助空间。
 *
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function addTwoNumbersForward(l1, l2) {
  const stack1 = [];
  const stack2 = [];

  // 1. 全部压栈
  for (let p = l1; p; p = p.next) stack1.push(p.val);
  for (let p = l2; p; p = p.next) stack2.push(p.val);

  let carry = 0;
  let head = null; // 结果链表头指针

  // 2. 从栈顶（最低位）逐位弹出相加
  while (stack1.length || stack2.length || carry) {
    const val1 = stack1.length ? stack1.pop() : 0;
    const val2 = stack2.length ? stack2.pop() : 0;
    const sum = val1 + val2 + carry;

    carry = Math.floor(sum / 10);
    // 3. 头插法构建正序链表（新节点指向原 head，再更新 head）
    head = new ListNode(sum % 10, head);
  }

  return head;
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
 * Q1: 为什么不先遍历链表把两个数字转成 Number/BigInt，直接相加再转回链表？
 * A1: 链表长度在题目中最高可达 100 甚至更长。JavaScript 中 `Number.MAX_SAFE_INTEGER` 仅能保证 16 位精度，直接转数字会发生严重的整型溢出和精度丢失；即使使用 BigInt，先转数字再转链表也需要 3 次完整转换，不如边遍历边构造新链表（流式处理）优雅高效。
 *
 * Q2: 为什么 while 循环条件必须加上 carry？
 * A2: 若不加 carry，当两条链表都遍历完毕但最后一轮产生了进位（例如 99 + 1），由于 l1 和 l2 均为 null 会提前跳出循环，导致最高位的进位 1 丢失。
 *
 * Q3: 如果数字是按正序存储的（最高位在链表头）该怎么解？
 * A3: 对应 LeetCode 445。两种解法：① 先反转两条输入链表，调用本题解法，最后再反转结果；② 使用两个辅助栈（Stack）将节点值压入栈中，通过出栈从低位到高位计算，并使用“头插法”生成正序结果链表。
 */

// —— 自测（逆序加法 LeetCode 2） ——
console.log(toArray(addTwoNumbers(build([2, 4, 3]), build([5, 6, 4]))));
// 期望： [7, 0, 8] (342 + 465 = 807)

console.log(toArray(addTwoNumbers(build([0]), build([0]))));
// 期望： [0]

console.log(toArray(addTwoNumbers(build([9, 9, 9, 9, 9, 9, 9]), build([9, 9, 9, 9]))));
// 期望： [8, 9, 9, 9, 0, 0, 0, 1] (最高位进位追加节点)

// —— 自测（正序加法 LeetCode 445） ——
console.log(toArray(addTwoNumbersForward(build([7, 2, 4, 3]), build([5, 6, 4]))));
// 期望： [7, 8, 0, 7] (7243 + 564 = 7807)

console.log(toArray(addTwoNumbersForward(build([9, 9]), build([1]))));
// 期望： [1, 0, 0] (99 + 1 = 100)

module.exports = { ListNode, build, toArray, addTwoNumbers, addTwoNumbersForward };
