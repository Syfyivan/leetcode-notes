/**
 * @param {number} n
 * @return {string[]}
 *
 * 思路：
 * 1. 左右括号各最多 n 个。还能放左就放左，右少于左才能放右。
 * 2. 右括号用满 n 个时收当前串。
 * 3. 边界：右不能超过左；左不能超过 n。
 * 复杂度：时间 O(4^n / √n)，空间 O(n)
 *
 * ——— 延伸 ———
 * - 判断合法括号：计数或栈，和生成是两道题。
 * - 先生成再过滤：废枝太多。合法约束下沉到搜索里。
 * - n 对括号的数量是卡特兰数 C_n。
 *
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
