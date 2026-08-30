/**
 * 最小栈（LeetCode 155）
 *
 * 设计一个支持 push、pop、top 操作，并能在常数时间内检索到最小元素的栈。
 * 实现 MinStack 类：
 *   push(val) 将元素 val 推入栈中；
 *   pop() 删除栈顶的元素；
 *   top() 获取栈顶元素；
 *   getMin() 获取栈中的最小元素。
 *
 * 思路：
 * 1. 主栈存全部元素。辅助栈同步存「当前栈内最小值」。
 * 2. push 时辅助栈压 min(val, 栈内最小)。pop 两个栈一起弹。
 * 3. 边界：题目保证 pop / top / getMin 在非空时调用。
 * 复杂度：时间 O(1) 每操作，空间 O(n)
 *
 * ——— 示例 ———
 * 输入：
 *   ["MinStack","push","push","push","getMin","pop","top","getMin"]
 *   [[],[-2],[0],[-3],[],[],[],[]]
 * 输出：
 *   [null,null,null,null,-3,null,0,-2]
 *
 * ——— 延伸 ———
 * - 最大栈：辅助栈改存 max。
 * - 常数空间：差值法，min 单独一个变量，栈里存 val - min。有溢出风险。
 * - 带 getMin 的队列：两个单调队列，或栈模拟队列再套最小栈。
 *
 * ——— 常见追问 ———
 * Q: 辅助栈为什么每次都压？
 * A: 跟主栈等高，pop 直接一起弹。只在更小时压，pop 时要判断是不是弹出了当前 min，容易漏。
 *
 * Q: 重复最小值怎么办？
 * A: 每次都压就没事。-2 压两次，弹一次 min 还是 -2。
 *
 * Q: 能用一个栈吗？
 * A: 能，元素改成 {val, min}。空间还是 O(n)，只是少一个数组。
 *
 * Q: 空栈 getMin？
 * A: 题目保证非空。自己写要先判 length。
 */

class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  /**
   * @param {number} val
   * @return {void}
   */
  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min); // 每次都压，pop 时两个栈对齐，重复最小值也不会丢
  }

  /**
   * @return {void}
   */
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  /**
   * @return {number}
   */
  top() {
    return this.stack[this.stack.length - 1];
  }

  /**
   * @return {number}
   */
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// —— 自测 ——
const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin()); // -3
minStack.pop();
console.log(minStack.top()); // 0
console.log(minStack.getMin()); // -2

module.exports = { MinStack };
