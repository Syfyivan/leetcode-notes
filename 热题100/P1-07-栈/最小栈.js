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
 * ——— 示例 ———
 * 输入：
 *   ["MinStack","push","push","push","getMin","pop","top","getMin"]
 *   [[],[-2],[0],[-3],[],[],[],[]]
 * 输出：
 *   [null,null,null,null,-3,null,0,-2]
 */

class MinStack {
  constructor() {
  }

  /**
   * @param {number} val
   * @return {void}
   */
  push(val) {
  }

  /**
   * @return {void}
   */
  pop() {
  }

  /**
   * @return {number}
   */
  top() {
  }

  /**
   * @return {number}
   */
  getMin() {
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
