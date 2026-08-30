/**
 * 5. 最长回文子串
 *
 * 给你一个字符串 s，找到 s 中最长的回文子串。
 * （回文串：正着读和反着读都一样的字符串。子串：连续的字符序列。）
 *
 * 示例 1：
 *   输入：s = "babad"
 *   输出："bab"
 *   解释："aba" 同样是符合题意的答案。
 *
 * 示例 2：
 *   输入：s = "cbbd"
 *   输出："bb"
 *
 * 提示：
 *   1 <= s.length <= 1000
 *   s 仅由数字和英文字母组成
 *
 * 思路：
 * 1. dp[i][j] 表示 s[i..j] 是否回文。
 * 2. 先处理长度 1 和 2，再按长度递增：两端相同且内部是回文。
 * 3. 边界：长度必须从小到大填，内部区间才已经算过。
 * 复杂度：时间 O(n^2)，空间 O(n^2)
 *
 * ——— 延伸 ———
 * - 中心扩展：每个位置当中心，奇数偶数各扩一遍，空间 O(1)。
 * - Manacher：O(n)，面试讲思路即可。
 * - 最长回文子序列：可不连续，另一道区间 DP。
 *
 * ——— 常见追问 ———
 * Q: 为什么按长度递增填？
 * A: dp[i][j] 依赖 dp[i+1][j-1]，短的先算，长的才能读到内部结果。
 *
 * Q: 长度 2 为什么单独处理？
 * A: 内部区间是空的。只看两端是否相同，不能走 len>=3 那条「看内部」的转移。
 *
 * Q: 全是相同字符？
 * A: 整串都是回文，max 会更新到 n，返回 s 本身。
 *
 * Q: 要长度不要子串？
 * A: 只维护 max 即可，不必记 start/end。
 */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    const dp = Array.from({length: s.length}, () => new Array(s.length).fill(true)) // 对角长度 1 必回文，先全填 true
    const dpLen = dp.length;
    let start = 0;
    let end = 0;
    let max = 1;


    for(let i = 0; i < dpLen ; i++) {
        if(s[i] != s[i + 1]) dp[i][i + 1] = false;
        else {
            max = 2;
            start = i;
            end = i + 1;
            };
    }
    for(let len = 3; len <= dpLen; len++ ) { // 按长度递增，保证 dp[i+1][j-1] 已填
        for(let i = 0; i <= dpLen - len; i++) {
            let j = i + len - 1;
            if(dp[i + 1][j - 1] === false) {
                dp[i][j] = false;
            } else {
                if(s[j] !== s[i]) {
                    dp[i][j] = false
                } else {
                    if(max < len ) {
                        start = i;
                        end = j;
                        max = len;
                    }
                }
            }
        }
    }
    return s.slice(start, end + 1);
};
