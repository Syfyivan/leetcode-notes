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
    this.hi.push(this.lo.pop()); // 保证 hi 的数都不小于 lo
    if (this.lo.size() < this.hi.size()) {
      this.lo.push(this.hi.pop());
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

// —— 自测 ——
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 1.5
mf.addNum(3);
console.log(mf.findMedian()); // 2

module.exports = { MedianFinder };
