/**
给你一个字符串 s，请你将 s 分割成一些 子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。

输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
 * 思路：
 * 1. 枚举切点，前缀是回文才切一刀，对剩余串继续切。
 * 2. 剩余为空时收一份 path 拷贝。
 * 3. 边界：单字符一定是回文；切完必须 pop。
 * 复杂度：时间 O(n * 2^n)，空间 O(n)
 *
 * ——— 延伸 ———
 * - 预处理 dp[i][j] 是否回文，切的时候判断变 O(1)。
 * - 只问方案数：改成 DP，不必把每条 path 存下来。
 * - 最长回文子串：中心扩展或 DP，用不着回溯。
 *
 * ——— 常见追问 ———
 * Q: 为什么从长度 1 开始切？
 * A: 单字符一定是回文，保证至少能切下去。i 取 0 会切出空串，死循环。
 *
 * Q: 必须拷贝 path 吗？
 * A: 必须。path 会被 pop 改掉，res 里要的是当时那一份。
 *
 * Q: 时间为什么是 2^n？
 * A: 每个间隙可切可不切，再乘上判断回文的 O(n)。预处理后判断降到 O(1)。
 *
 * Q: 整串就是回文呢？
 * A: 会收入 [s] 这一份，也会收入更碎的切法，题目要全部方案。
 */
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function(s) {
    const res = [];
    const path = [];

    const judge = (str) => {
        const len = str.length;
        if(len === 1) return true; // 单字符必回文，保证一定切得动
        let right = len - 1;
        for(let i = 0; i < right; i++) {
            if(str[i] != str[right]) {
                return false
            }
            right--
        }
        return true;
    }

    const dfs = (str) => {
        if(str.length === 0) {
            res.push([...path]); // 剩余切空，这一份方案成型
            return;}
        for(let i = 1; i <= str.length; i++) { // i 从 1 起，避免空前缀死循环
            const tmp = str.slice(0, i);
            if(judge(tmp)) {
                path.push(tmp);
                dfs(str.slice(i, str.length));
                path.pop(); // 换下一个切点前撤掉这一刀
            }
        }
    }
    dfs(s);
    return res;
};
