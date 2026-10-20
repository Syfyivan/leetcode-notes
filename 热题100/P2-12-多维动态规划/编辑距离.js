/**
 * 热题 100 · 编辑距离
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 编辑距离（LeetCode 72）
 *
 * 给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的最少操作数。
 * 你可以对一个单词进行如下三种操作：插入一个字符、删除一个字符、替换一个字符。
 *
 * ——— 示例 ———
 * 输入： word1 = "horse", word2 = "ros"
 * 输出： 3
 *
 * 输入： word1 = "intention", word2 = "execution"
 * 输出： 5
 *
 * 思路：
 * 1. dp[i][j] 表示 word1 前 i 个变成 word2 前 j 个的最少操作。
 * 2. 末尾相同沿用 dp[i-1][j-1]；否则 min(插、删、替)+1。
 * 3. 边界：空串变成另一串的代价是长度本身。
 * 复杂度：时间 O(mn)，空间 O(mn)
 */

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i; // 删掉 word1 前 i 个
    for (let j = 0; j <= n; j++) dp[0][j] = j; // 插入 word2 前 j 个
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]; // 末尾相同，这对不用动
            } else {
                dp[i][j] = Math.min(
                    dp[i][j - 1],     // 插入 word2[j-1]
                    dp[i - 1][j],     // 删除 word1[i-1]
                    dp[i - 1][j - 1]  // 替换成 word2[j-1]
                ) + 1;
            }
        }
    }
    return dp[m][n];
}

/**
 * 延伸 1：还原一组编辑操作
 *
 * 需求：返回最短距离和一种 insert/delete/replace 操作序列。
 *
 * 思路：先建完整 dp 表，再从右下角沿最优前驱倒推；相同字符直接走左上。
 *
 * ——— 示例 ———
 * 示例：horse → ros，可得到 replace h→r、delete r、delete e，共 3 步。
 *
 * 复杂度：时间 O(mn)，空间 O(mn)。
 */
function minDistanceWithOperations(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = word1[i - 1] === word2[j - 1]
        ? dp[i - 1][j - 1]
        : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }
  const operations = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) { i--; j--; }
    else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      operations.push({ type: 'replace', from: word1[i - 1], to: word2[j - 1], index: i - 1 });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      operations.push({ type: 'delete', value: word1[i - 1], index: i - 1 });
      i--;
    } else {
      operations.push({ type: 'insert', value: word2[j - 1], index: i });
      j--;
    }
  }
  return { distance: dp[m][n], operations: operations.reverse() };
}

/**
 * ——— 常见追问 ———
 * Q: 插、删、替分别对应哪一格？
 * A: 插看 dp[i][j-1]，删看 dp[i-1][j]，替看 dp[i-1][j-1]，都 +1。
 *
 * Q: 空串代价为什么是长度？
 * A: 空变 word2 只能一直插；word1 变空只能一直删。
 *
 * Q: 字符相同为什么直接抄对角？
 * A: 这对字符不用动，问题缩成两边都去掉末尾。
 *
 * Q: word1 为空？
 * A: 第一行初始化 dp[0][j] = j，循环不进内层，返回 n。
 */

// —— 自测 ——
console.log(minDistance("horse", "ros")); // 3
console.log(minDistance("intention", "execution")); // 5

module.exports = { minDistance, minDistanceWithOperations };
