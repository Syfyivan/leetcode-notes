/**
 * 热题 100 · 括号生成
 *
 * 优先级：Hot 100 · P2
 */

/**
 * @param {number} n
 * @return {string[]}
 *
 * 思路：
 * 1. 左右括号各最多 n 个。还能放左就放左，右少于左才能放右。
 * 2. 右括号用满 n 个时收当前串。
 * 3. 边界：右不能超过左；左不能超过 n。
 * 复杂度：时间 O(4^n / √n)，空间 O(n)
 */
var generateParenthesis = function(n) {
   const res = [];
   const path = [];
//    let left = 0;
//    let right = 0;

   const dfs = (left, right) => {
    if(right === n) {
        res.push(path.join(''));
        return;
    }
    if(left < n) { // 左括号还没放满 n 个
        path.push('(');
        dfs(left + 1, right)
        path.pop();
    }
    if(right < left) { // 右括号不能超过已放的左括号
        path.push(')');
        dfs(left, right + 1);
        path.pop();
    }
   }
   dfs(0, 0)
   return res;
};

/**
 * 延伸 1：只计算合法组合数量
 *
 * 需求：返回 n 对括号的方案数，不生成具体字符串。
 *
 * 思路：卡特兰递推 count[n] = Σ count[left] * count[n-1-left]。
 *
 * ——— 示例 ———
 * 示例：n=3 输出 5。
 *
 * 复杂度：时间 O(n²)，空间 O(n)。
 */
function countParenthesis(n) {
  const counts = new Array(n + 1).fill(0);
  counts[0] = 1;
  for (let pairs = 1; pairs <= n; pairs++) {
    for (let left = 0; left < pairs; left++) {
      counts[pairs] += counts[left] * counts[pairs - 1 - left];
    }
  }
  return counts[n];
}

/**
 * ——— 常见追问 ———
 * Q: 为什么右括号不能超过左？
 * A: 超过就会出现前缀里 ) 更多，一定非法。门卫挡在搜索里，不要事后过滤。
 *
 * Q: 终止条件为什么看 right === n？
 * A: 右能放到 n，说明左已经满了（右始终 <= 左 <= n）。串长度一定是 2n。
 *
 * Q: 用字符串拼接可以吗？
 * A: 可以，dfs(str + '(')。JS 字符串不可变，每次新串；path+join 省几次分配。
 *
 * Q: 时间怎么来的？
 * A: 卡特兰数大约 4^n / n^1.5，再乘拼串成本。
 */

// —— 自测 ——
console.log(generateParenthesis(3).length); // 5

module.exports = { generateParenthesis, countParenthesis };
