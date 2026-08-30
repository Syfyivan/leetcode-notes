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
    cur.next = l1 || l2;
    return dummy.next;
  };
  return merge(sortList(head), sortList(mid));
}

// —— 自测 ——
console.log(toArray(sortList(build([4, 2, 1, 3]))));     // 期望： [1,2,3,4]
console.log(toArray(sortList(build([-1, 5, 3, 4, 0])))); // 期望： [-1,0,3,4,5]
console.log(toArray(sortList(build([]))));               // 期望： []

module.exports = { ListNode, build, toArray, sortList };
