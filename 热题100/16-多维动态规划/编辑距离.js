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
 */

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
}

// —— 自测 ——
console.log(minDistance("horse", "ros")); // 3
console.log(minDistance("intention", "execution")); // 5

module.exports = { minDistance };
