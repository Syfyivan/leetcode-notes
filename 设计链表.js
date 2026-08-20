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
 * ——— 示例 ———
 * const l = new MyLinkedList();
 * l.addAtHead(1);
 * l.addAtTail(3);
 * l.addAtIndex(1, 2);   // 链表变为 1 -> 2 -> 3
 * l.get(1);             // 2
 * l.deleteAtIndex(1);   // 链表变为 1 -> 3
 * l.get(1);             // 3
 */

class MyLinkedList {
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
