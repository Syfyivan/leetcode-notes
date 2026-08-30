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
    this.minStack.push(min);
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
