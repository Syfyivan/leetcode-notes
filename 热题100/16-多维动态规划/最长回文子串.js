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
 */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    const dp = Array.from({length: s.length}, () => new Array(s.length).fill(true))
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
    for(let len = 3; len <= dpLen; len++ ) {
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
