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
    if(left < n) {
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
