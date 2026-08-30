/**
 * 设计链表 MyLinkedList（LeetCode 707，单链表版）
 *
 * 实现一个单链表，支持以下方法：
 *   - get(index)              返回第 index 个节点的值（0 起）；非法索引返回 -1
 *   - addAtHead(val)          在头部插入
 *   - addAtTail(val)          在尾部插入
 *   - addAtIndex(index, val)  在第 index 个位置前插入
 *                             （index === 长度 时追加到尾部；index > 长度 时不插入）
 *   - deleteAtIndex(index)    删除第 index 个节点（索引合法才删）
 *   - forEach(callbackFn)     从头到尾遍历，对每个节点值调用 callbackFn(val, index)
 *
 * 注意（来自你之前的讨论）：
 *   - 严格按题意处理索引合法性，不自行增加题目没要求的规则
 *     （比如"负下标按头插处理"这种额外行为，题目没说就别加）。
 *   - 可以考虑用虚拟头节点 + 尾指针来简化边界 / 优化 addAtTail，但这是你的选择。
 *
 * 思路：
 * 1. 虚拟头节点，get / 插入 / 删除都从 dummy 走到 index 的前驱。
 * 2. addAtIndex：index === size 是尾插，index > size 或 index < 0 直接 return。
 * 3. 记 size，get 和 delete 用它判断越界。
 * 4. 边界 / 易错：index 为负不要当头插，题目没这规则。
 *
 * ——— 示例 ———
 * const l = new MyLinkedList();
 * l.addAtHead(1);
 * l.addAtTail(3);
 * l.addAtIndex(1, 2);   // 链表变为 1 -> 2 -> 3
 * l.get(1);             // 2
 * l.deleteAtIndex(1);   // 链表变为 1 -> 3
 * l.get(1);             // 3
 *
 * ——— 延伸 ———
 * - 尾指针 tail：addAtTail 变 O(1)。删尾时要回退找新尾，单链表这一下仍是 O(n)。
 * - 双向链表：前驱 O(1) 就能改，LC 707 官方也收双链表写法。
 * - 下标改成 1-based：面试有时换规则，边界判断一起改，别只改注释。
 *
 * ——— 常见追问 ———
 * Q: 虚拟头干什么用？
 * A: 头插、删头和中间操作走同一条路，都改 prev.next。没有 dummy，空链表 / 头节点要单独写。
 *
 * Q: index === size 为什么能插？
 * A: 题意规定这时追加到尾部。index > size 才是非法，直接 return。
 *
 * Q: 负下标要不要当头插？
 * A: 不要。题目没这规则。index < 0 一律忽略。
 *
 * Q: get 为什么走 prev(index).next？
 * A: prev 停在目标前驱，再 .next 才是 index 自己。插入删除也要前驱，一个辅助函数三种操作用。
 */

function ListNode(val) {
  this.val = val;
  this.next = null;
}

class MyLinkedList {
  constructor() {
    this.dummy = new ListNode(0); // 空门岗，头插/删头不用单独写
    this.size = 0;
  }

  prev(index) {
    let cur = this.dummy; // dummy 是 -1 号，走 index 步就是目标前驱
    for (let i = 0; i < index; i++) cur = cur.next;
    return cur;
  }

  get(index) {
    if (index < 0 || index >= this.size) return -1;
    return this.prev(index).next.val; // prev 停在前驱，.next 才是目标
  }

  addAtHead(val) {
    this.addAtIndex(0, val);
  }

  addAtTail(val) {
    this.addAtIndex(this.size, val);
  }

  addAtIndex(index, val) {
    if (index < 0 || index > this.size) return; // = size 是尾插，> size 才丢
    const prev = this.prev(index);
    const node = new ListNode(val);
    node.next = prev.next; // 先接后面，再让前驱指过来
    prev.next = node;
    this.size++;
  }

  deleteAtIndex(index) {
    if (index < 0 || index >= this.size) return;
    const prev = this.prev(index);
    prev.next = prev.next.next; // 前驱跳过目标，目标不可达
    this.size--;
  }

  forEach(callbackFn) {
    let cur = this.dummy.next;
    let i = 0;
    while (cur) {
      callbackFn(cur.val, i);
      cur = cur.next;
      i++;
    }
  }
}

// —— 自测（对照上面示例，应打印 2, 3）——
const l = new MyLinkedList();
l.addAtHead(1);
l.addAtTail(3);
l.addAtIndex(1, 2);
console.log(l.get(1)); // 2
l.deleteAtIndex(1);
console.log(l.get(1)); // 3

module.exports = { MyLinkedList };
