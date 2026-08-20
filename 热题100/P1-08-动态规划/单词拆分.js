// 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。

// 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

 

// 示例 1：

// 输入: s = "leetcode", wordDict = ["leet", "code"]
// 输出: true
// 解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。

/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const len = s.length
    const dp = new Array(len + 1).fill(false);
    dp[0] = true;

    for(let i = 1; i <= len; i++) {
        for(let j = 0; j < i; j++) {
            if(wordSet.has(s.slice(j, i)) && dp[j]) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[len];
    
};