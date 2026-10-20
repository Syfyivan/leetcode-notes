/**
 * 热题 100 · 杨辉三角
 *
 * 优先级：Hot 100 · P1
 */

/**
 * 思路：
 * 1. 第 i 行有 i+1 个数，两端是 1。
 * 2. 中间 res[i][j] = res[i-1][j-1] + res[i-1][j]。
 * 3. 边界：numRows=1 只返回 [[1]]，别预先写好第二行。
 * 复杂度：时间 O(numRows^2)，空间 O(numRows^2)

 *
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const res = [];
    for(let i = 0; i < numRows; i++) {
        res[i] = [];
        res[i][0] = 1;
        res[i][i] = 1; // 两端 C(i,0)/C(i,i)，i=0 时两个下标重合
        for(let j = 1; j < i; j++) {
            res[i][j] = res[i - 1][j -1] + res[i - 1][j]; // C(i,j) = C(i-1,j-1) + C(i-1,j)
        }
    }
    return res;
};

/**
 * 延伸 1：只生成第 rowIndex 行（LeetCode 119）
 *
 * 需求：使用 O(rowIndex) 空间返回指定的 0-based 行。
 *
 * 思路：一维数组从右向左更新，避免本轮新值覆盖仍要使用的上一行值。
 *
 * ——— 示例 ———
 * 示例：rowIndex=3 输出 [1,3,3,1]。
 *
 * 复杂度：时间 O(k²)，空间 O(k)。
 */
function getPascalRow(rowIndex) {
  const row = new Array(rowIndex + 1).fill(0);
  row[0] = 1;
  for (let i = 1; i <= rowIndex; i++) {
    for (let j = i; j >= 1; j--) row[j] += row[j - 1];
  }
  return row;
}

/**
 * ——— 常见追问 ———
 * Q: 为什么两端先写 1？
 * A: C(i, 0) = C(i, i) = 1。中间才用上一行相加。
 *
 * Q: j 从 1 到 i-1？
 * A: 两端已经填好。i = 0、1 时内层循环不进。
 *
 * Q: 和组合数的关系？
 * A: 第 i 行第 j 个是 C(i, j)。递推 C(i, j) = C(i-1, j-1) + C(i-1, j)。
 *
 * Q: 溢出？
 * A: JS Number 到第 30 行左右还行，再大用 BigInt。题目 numRows 通常 <= 30。
 */

// —— 自测 ——
console.log(generate(5));

module.exports = { generate, getPascalRow };
