/**
 * @param {number} n
 * @return {string[]}
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
    if(right < left) {
        path.push(')');
        dfs(left, right + 1);
        path.pop();
    }
   }
   dfs(0, 0)
   return res;
};