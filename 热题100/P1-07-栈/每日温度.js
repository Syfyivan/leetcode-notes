/**
 * 热题 100 · 每日温度
 *
 * 优先级：Hot 100 · P1
 */

/**
 * 每日温度（LeetCode 739）
 *
 * 给定一个整数数组 temperatures，表示每天的温度，返回一个数组 answer，
 * 其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。
 * 如果气温在这之后都不会升高，则 answer[i] 用 0 来代替。
 *
 * 思路：
 * 1. 单调栈存还没等到更高温度的下标，栈底到栈顶温度递减。
 * 2. 扫到更高的那天，弹出栈顶，答案就是间隔天数 i - idx。
 * 3. 边界：最后还在栈里的天，后面没有更高，保持 0。
 * 复杂度：时间 O(n)，空间 O(n)
 *
 * ——— 示例 ———
 * 输入： temperatures = [73,74,75,71,69,72,76,73]
 * 输出： [1,1,4,2,1,1,0,0]
 *
 * 输入： temperatures = [30,40,50,60]
 * 输出： [1,1,1,0]
 *
 * 输入： temperatures = [30,60,90]
 * 输出： [1,1,0]
 */

/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = new Array(n).fill(0);
  const stack = []; // 存下标
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) { // 相等不算更高，不弹
      const idx = stack.pop();
      ans[idx] = i - idx;
    }
    stack.push(i);
  }
  return ans;
}

/**
 * 延伸 1：循环数组的下一个更大元素（LeetCode 503）
 *
 * 需求：数组首尾相接，为每项返回下一个更大值；不存在返回 -1。
 *
 * 思路：下标扫描两轮，栈保存仍未找到答案的下标；第二轮只出栈，不重复入栈。
 *
 * ——— 示例 ———
 * 示例：[1,2,1] 输出 [2,-1,2]。
 *
 * 复杂度：时间 O(n)，空间 O(n)。
 */
function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length * 2; i++) {
    const index = i % nums.length;
    while (stack.length && nums[stack.at(-1)] < nums[index]) {
      result[stack.pop()] = nums[index];
    }
    if (i < nums.length) stack.push(index);
  }
  return result;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么栈里温度递减？
 * A: 还没等到更高的天。遇到更高就把它们结算掉。递增的话栈顶已经更大，等不到。
 *
 * Q: 答案初始为什么填 0？
 * A: 后面没有更高就保持 0。最后留在栈里的天正好用上。
 *
 * Q: 相等温度弹不弹？
 * A: 不弹。题目要更高，相等不算。用 > 不是 >=。
 *
 * Q: 能不能 DP？
 * A: 能，从后往前跳。最坏还是 O(n^2)。单调栈保证每个下标进出一次。
 */

// —— 自测 ——
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // [1,1,4,2,1,1,0,0]
console.log(dailyTemperatures([30, 40, 50, 60])); // [1,1,1,0]
console.log(dailyTemperatures([30, 60, 90])); // [1,1,0]

module.exports = { dailyTemperatures, nextGreaterElements };
