// 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。

// 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

 

// 示例 1：

// 输入: s = "leetcode", wordDict = ["leet", "code"]
// 输出: true
// 解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。

/**
 * 思路：
 * 1. dp[i] = s 的前 i 个字符能不能被字典拼出来。
 * 2. 枚举切点 j，dp[j] 为真且 s[j..i) 在字典里，则 dp[i] 为真。
 * 3. 边界：dp[0]=true，空前缀默认能拼。字典放进 Set 方便查。
 * 复杂度：时间 O(n^2 * k)，空间 O(n + 字典)，k 是单词平均长度
 *
 * ——— 延伸 ———
 * - 返回一种拆法：记下切点，最后还原。
 * - 返回所有拆法（LC 140）：回溯 + 记忆化，注意组合爆炸。
 * - 字典树加速：wordDict 建 Trie，从 i 往后匹配。
 *
 * ——— 常见追问 ———
 * Q: dp[0] = true？
 * A: 空前缀默认能拼。否则第一个词永远接不上。
 *
 * Q: 为什么 break？
 * A: 前 i 个已经能拼，不必再试别的切点。只要存在一种。
 *
 * Q: 字典词能重复用吗？
 * A: 能。Set 只判断在不在，不删。
 *
 * Q: 时间为什么带 k？
 * A: slice + Set 查找跟单词长度有关。最坏每个切点都切一遍。
 *
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const len = s.length
    const dp = new Array(len + 1).fill(false);
    dp[0] = true; // 空前缀可拼，第一个词才能接上

    for(let i = 1; i <= len; i++) {
        for(let j = 0; j < i; j++) {
            if(wordSet.has(s.slice(j, i)) && dp[j]) {
                dp[i] = true;
                break; // 有一种拆法就够，不必穷举切点
            }
        }
    }
    return dp[len];
};
