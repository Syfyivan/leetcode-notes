/**
 * 热题 100 · 数据流的中位数
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 数据流的中位数（LeetCode 295）
 *
 * 中位数是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。
 * 实现 MedianFinder 类：
 *   addNum(num) 将数据流中的整数 num 添加到数据结构中；
 *   findMedian() 返回到目前为止所有元素的中位数。
 *
 * ——— 示例 ———
 * 输入：
 *   ["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
 *   [[],[1],[2],[],[3],[]]
 * 输出：
 *   [null,null,null,1.5,null,2.0]
 *
 * 思路：
 * 1. 对顶堆：大根堆 lo 存较小一半，小根堆 hi 存较大一半。
 * 2. 新数先进 lo，再把 lo 顶挪到 hi；hi 更长时再挪回 lo，保持 lo 比 hi 多 0 或 1 个。
 * 3. 边界：奇数取 lo 顶，偶数取两顶平均。
 * 复杂度：add O(log n)，查询 O(1)，空间 O(n)
 *
 * ——— 延伸 ———
 * - 动态第 k 小：两堆大小差改成 k，lo 多留 k 个。
 * - 要支持删除：懒删除配堆，或换平衡树。
 * - 偶数取平均：注意 JS 除法已经是浮点。
 *
 * ——— 常见追问 ———
 * Q: 为什么新数先扔进 lo 再挪到 hi？
 * A: 先让大根堆消化，再把过大的顶交给小根堆，保证 hi 的数都不小于 lo。
 *
 * Q: 两堆大小关系？
 * A: lo 比 hi 多 0 或 1 个。奇数中位数就是 lo 顶。
 *
 * Q: 还没 add 就 find？
 * A: 题目保证至少有一个数。空堆 peek 是 undefined，面试可加保护。
 *
 * Q: JS 没有现成堆怎么办？
 * A: 自己写二叉堆，或用排序数组二分插入。后者 add 是 O(n)，数据流大会爆。
 */

class Heap {
  constructor(cmp) {
    this.data = [];
    this.cmp = cmp;
  }
  size() {
    return this.data.length;
  }
  peek() {
    return this.data[0];
  }
  push(x) {
    this.data.push(x);
    this._up(this.data.length - 1);
  }
  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length) {
      this.data[0] = last;
      this._down(0);
    }
    return top;
  }
  _up(i) {
    const { data, cmp } = this;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (cmp(data[i], data[p]) >= 0) break;
      const t = data[i];
      data[i] = data[p];
      data[p] = t;
      i = p;
    }
  }
  _down(i) {
    const { data, cmp } = this;
    const n = data.length;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = l + 1;
      if (l < n && cmp(data[l], data[m]) < 0) m = l;
      if (r < n && cmp(data[r], data[m]) < 0) m = r;
      if (m === i) break;
      const t = data[i];
      data[i] = data[m];
      data[m] = t;
      i = m;
    }
  }
}

class MedianFinder {
  constructor() {
    this.lo = new Heap((a, b) => b - a); // 大根堆，较小一半
    this.hi = new Heap((a, b) => a - b); // 小根堆，较大一半
  }

  /**
   * @param {number} num
   * @return {void}
   */
  addNum(num) {
    this.lo.push(num);
    this.hi.push(this.lo.pop()); // 新数可能偏大，经 lo 过滤后再给 hi
    if (this.lo.size() < this.hi.size()) {
      this.lo.push(this.hi.pop()); // hi 更长时挪回，保持 lo 多 0 或 1
    }
  }

  /**
   * @return {number}
   */
  findMedian() {
    if (this.lo.size() > this.hi.size()) return this.lo.peek();
    return (this.lo.peek() + this.hi.peek()) / 2;
  }
}

/**
 * 延伸 1：有序数组版数据流中位数
 *
 * 需求：实现一个更容易手写和验证的版本，适合写入次数少、查询次数多的场景。
 *
 * 思路：每次用二分查找插入位置，再用 splice 保持数组有序；查询时直接读取中间位置。
 *
 * ——— 示例 ———
 * 示例：依次加入 1、2、3，中位数依次为 1、1.5、2。
 *
 * 复杂度：addNum 时间 O(n)，findMedian 时间 O(1)，空间 O(n)
 */
class MedianFinderSortedArray {
  constructor() {
    this.data = [];
  }

  addNum(num) {
    let left = 0;
    let right = this.data.length;
    while (left < right) {
      const mid = left + ((right - left) >> 1);
      if (this.data[mid] < num) left = mid + 1;
      else right = mid;
    }
    this.data.splice(left, 0, num);
  }

  findMedian() {
    const n = this.data.length;
    if (n === 0) return undefined;
    const mid = n >> 1;
    return n % 2 === 1 ? this.data[mid] : (this.data[mid - 1] + this.data[mid]) / 2;
  }
}

// —— 自测 ——
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 1.5
mf.addNum(3);
console.log(mf.findMedian()); // 2

const sortedMf = new MedianFinderSortedArray();
sortedMf.addNum(3);
sortedMf.addNum(1);
sortedMf.addNum(2);
console.log(sortedMf.findMedian()); // 2

module.exports = { MedianFinder, MedianFinderSortedArray };
