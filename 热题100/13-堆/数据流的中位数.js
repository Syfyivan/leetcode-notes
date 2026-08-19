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
 */

class MedianFinder {
  constructor() {
    // TODO
  }

  /**
   * @param {number} num
   * @return {void}
   */
  addNum(num) {
    // TODO
  }

  /**
   * @return {number}
   */
  findMedian() {
    // TODO
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
