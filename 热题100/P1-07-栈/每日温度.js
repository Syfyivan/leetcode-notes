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
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const idx = stack.pop();
      ans[idx] = i - idx;
    }
    stack.push(i);
  }
  return ans;
}

// —— 自测 ——
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // [1,1,4,2,1,1,0,0]
console.log(dailyTemperatures([30, 40, 50, 60])); // [1,1,1,0]
console.log(dailyTemperatures([30, 60, 90])); // [1,1,0]

module.exports = { dailyTemperatures };
