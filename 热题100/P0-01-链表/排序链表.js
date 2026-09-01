/**
 * 热题 100 · 排序链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 排序链表（LeetCode 148）
 *
 * 给定链表的头节点 head，请将其按升序排列并返回排序后的链表。
 *
 * 进阶：能否在 O(n log n) 时间复杂度和常数级空间复杂度下完成？
 *
 * 思路：
 * 1. 链表按升序排。
 * 2. 归并：快慢指针拆成两半，递归排完再合并。
 * 3. 空或单节点已经有序。拆的时候要把前半的尾 next 置空。
 * 复杂度：时间 O(n log n)，空间 O(log n) 递归栈
 *
 * ——— 示例 ———
 * 输入： head = [4,2,1,3]
 * 输出： [1,2,3,4]
 *
 * 输入： head = [-1,5,3,4,0]
 * 输出： [-1,0,3,4,5]
 *
 * 输入： head = []
 * 输出： []
 *
 * ——— 延伸 ———
 * - 自底向上归并：先 1 个一组，再 2、4、8，迭代做，空间真 O(1)。
 * - 快排也能写，链表换节点比换值麻烦，最坏 O(n²)。
 * - 数组归并同一套：拆两半、递归、合并。
 *
 * ——— 常见追问 ———
 * Q: 快指针为什么从 head.next 起步？
 * A: 从 head 起，偶数个时 slow 会停在后半开头，切断位置偏后。
 *    从 next 起 slow 稳停前半尾。
 *
 * Q: 为什么必须 slow.next = null？
 * A: 不切断两条链还连着，merge 会死循环。
 *
 * Q: 递归空间不是常数？
 * A: 栈是 O(log n)。题目进阶要 O(1) 得改自底向上。
 *
 * Q: 时间？
 * A: 每层 merge O(n)，层数 log n，一共 O(n log n)。
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
function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head;
  let fast = head.next; // 从 next 起，保证 slow 停在前半尾
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null; // 切断，否则归并死循环
  const merge = (l1, l2) => {
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
    cur.next = l1 || l2; // 剩下已有序，整段挂上
    return dummy.next;
  };
  return merge(sortList(head), sortList(mid));
}

/**
 * 延伸 1：借助数组排序
 *
 * 需求：先写一个便于核对结果的基准版本，不追求 O(1) 额外空间。
 *
 * 思路：收集所有节点值，数值排序后重新建立链表；适合做归并版本的对拍答案。
 *
 * ——— 示例 ———
 * 示例：4→2→1→3，输出 1→2→3→4。
 *
 * 复杂度：时间 O(n log n)，空间 O(n)。
 */
function sortListWithArray(head) {
  const values = [];
  for (let node = head; node; node = node.next) values.push(node.val);
  values.sort((a, b) => a - b);
  return build(values);
}

// —— 自测 ——
console.log(toArray(sortList(build([4, 2, 1, 3]))));     // 期望： [1,2,3,4]
console.log(toArray(sortList(build([-1, 5, 3, 4, 0])))); // 期望： [-1,0,3,4,5]
console.log(toArray(sortList(build([]))));               // 期望： []

module.exports = { ListNode, build, toArray, sortList, sortListWithArray };
