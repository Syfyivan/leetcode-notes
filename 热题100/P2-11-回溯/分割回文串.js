/**
 * 热题 100 · 分割回文串
 *
 * 优先级：Hot 100 · P2
 */

/**
给你一个字符串 s，请你将 s 分割成一些 子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。

输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
 * 思路：
 * 1. 枚举切点，前缀是回文才切一刀，对剩余串继续切。
 * 2. 剩余为空时收一份 path 拷贝。
 * 3. 边界：单字符一定是回文；切完必须 pop。
 * 复杂度：时间 O(n * 2^n)，空间 O(n)
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

/**
 * 延伸 1：分割回文串的最少切割次数（LeetCode 132）
 *
 * 需求：把字符串切成若干回文子串，返回最少切几刀。
 *
 * 思路：先预处理 palindrome[left][right]，再让 cuts[end] 枚举最后一段起点。
 *
 * ——— 示例 ———
 * 示例："aab" 输出 1（"aa" | "b"）。
 *
 * 复杂度：时间 O(n²)，空间 O(n²)。
 */
function minCutPalindrome(s) {
  const n = s.length;
  if (n === 0) return 0;
  const palindrome = Array.from({ length: n }, () => new Array(n).fill(false));
  const cuts = new Array(n).fill(0);
  for (let right = 0; right < n; right++) {
    cuts[right] = right;
    for (let left = 0; left <= right; left++) {
      if (s[left] === s[right] && (right - left <= 2 || palindrome[left + 1][right - 1])) {
        palindrome[left][right] = true;
        cuts[right] = left === 0 ? 0 : Math.min(cuts[right], cuts[left - 1] + 1);
      }
    }
  }
  return cuts[n - 1];
}

/**
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

// —— 自测 ——
console.log(partition('aab')); // [['a','a','b'],['aa','b']]

module.exports = { partition, minCutPalindrome };
