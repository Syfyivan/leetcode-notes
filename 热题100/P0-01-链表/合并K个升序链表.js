/**
 * 热题 100 · 合并K个升序链表
 *
 * 优先级：Hot 100 · P0
 */

/**
 * 合并 K 个升序链表（LeetCode 23 · 困难）
 *
 * 【题目描述】
 * 给你一个链表数组 lists ，每个链表都已经按升序排列。
 * 请你将所有链表合并到一个升序链表中，返回合并后的链表。
 *
 * ——— 解法演进与对比 ———
 * 假设共有 k 条链表，所有链表的节点总数为 N：
 * 1. 朴素顺序累加合并：
 *    - 从第 1 条开始，依次和第 2、3...k 条合并。
 *    - 缺点：前面的链表节点会被反复扫描 k 次，时间复杂度高达 O(k · N)，容易超时。
 *
 * 2. 递归分治合并（Divide and Conquer，推荐，标准归并思路）：
 *    - 将 lists 数组从中间对半切开，分别递归合并左半部分和右半部分。
 *    - 最后调用 `mergeTwoLists` 将左右两大部分合并为一条。
 *    - 时间复杂度：O(N log k)，递归树共 log k 层，每层遍历所有 N 个节点。
 *    - 空间复杂度：O(log k) 递归栈空间。
 *
 * 3. 迭代两两合并（自底向上分治，进阶，O(1) 空间）：
 *    - 步长 step 从 1 开始翻倍（1 -> 2 -> 4 -> 8...）。
 *    - 每一轮将 lists[i] 和 lists[i + step] 原地合并并存回 lists[i]。
 *    - 时间复杂度：O(N log k)，空间复杂度：O(1)。
 *
 * ——— 分治合并树图解（以 k = 4 条链表为例） ———
 *   lists[0]    lists[1]    lists[2]    lists[3]   （第 0 层：4 条链表）
 *      \           /           \           /
 *     mergeTwoLists           mergeTwoLists        （第 1 层：合并为 2 条链表）
 *           \                       /
 *             \                   /
 *                 mergeTwoLists                    （第 2 层：最终合并为 1 条链表）
 *
 * ——— 复杂度深度分析 ———
 * 时间复杂度：O(N log k)
 *   - 递归树共有 ⌈log₂ k⌉ 层。
 *   - 每一层中，所有的 N 个节点都恰好参与一次两两合并（每个节点被比较和重连常数次）。
 *   - 因此总时间为 N × log k = O(N log k)。
 * 空间复杂度：
 *   - 递归分治：O(log k)，递归树深度为 log k。
 *   - 迭代分治：O(1)，直接在原 lists 数组或指针上进行两两折半合并。
 */

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 辅助函数：合并两个有序链表（原子操作）
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
 * 递归分治解法
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;

  // 递归分治合并区间 [left, right] 内的链表
  const divideAndConquer = (left, right) => {
    if (left === right) return lists[left];
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);
    const l1 = divideAndConquer(left, mid);
    const l2 = divideAndConquer(mid + 1, right);

    return mergeTwo(l1, l2);
  };

  return divideAndConquer(0, lists.length - 1);
}

/**
 * 延伸 1：迭代分治法（自底向上，空间 O(1)）
 *
 * 需求：消除递归调用栈，使用步长翻倍法在数组上两两合并。
 *
 * 思路：
 * 步长 step 依次取 1, 2, 4, 8...
 * 每次将 lists[i] 与 lists[i + step] 两两合并并写回 lists[i]。
 *
 * 复杂度：时间 O(N log k)，空间 O(1)。
 *
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKListsIterative(lists) {
  if (!lists || lists.length === 0) return null;

  const arr = lists.slice(); // 浅拷贝指针数组
  let amount = arr.length;
  let interval = 1;

  while (interval < amount) {
    for (let i = 0; i + interval < amount; i += interval * 2) {
      arr[i] = mergeTwo(arr[i], arr[i + interval]);
    }
    interval *= 2;
  }

  return arr[0];
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
 * Q1: 能用优先队列/小顶堆（Min-Heap）解决吗？复杂度如何？
 * A1: 可以。将每条链表的当前头节点放入大小为 k 的小顶堆中，每次弹出堆顶（全局最小值）拼接到结果链表，再把该节点的 next 塞入堆中。总共弹出 N 次，每次堆调整耗时 O(log k)，总时间也是 O(N log k)，堆的额外空间为 O(k)。
 *
 * Q2: 边界情况如 `lists = []` 或 `lists = [[]]` 怎么处理？
 * A2:
 *   - 当 `lists` 长度为 0 时，直接返回 null。
 *   - 当某一条链表为空时（例如 `[[], [1,2]]`），底层 `mergeTwoLists` 会识别出 `!l1` 并直接返回另一条，安全鲁棒。
 */

// —— 自测（递归分治版） ——
console.log(toArray(mergeKLists([build([1, 4, 5]), build([1, 3, 4]), build([2, 6])])));
// 期望： [1, 1, 2, 3, 4, 4, 5, 6]

console.log(toArray(mergeKLists([])));
// 期望： []

console.log(toArray(mergeKLists([build([])])));
// 期望： []

console.log(toArray(mergeKLists([build([]), build([1])])));
// 期望： [1]

// —— 自测（迭代分治版） ——
console.log(toArray(mergeKListsIterative([build([1, 4, 5]), build([1, 3, 4]), build([2, 6])])));
// 期望： [1, 1, 2, 3, 4, 4, 5, 6]

module.exports = { ListNode, build, toArray, mergeKLists, mergeKListsIterative };
