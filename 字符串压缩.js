/**
 * 字符串压缩（面试题 01.06）
 *
 * @param {string} S
 * @return {string}
 *
 * 统计连续相同字符的次数，拼成 字符+次数。
 * 压缩后若没有严格变短，返回原串。
 *
 * 思路：
 * 1. 双指针扫连续相同字符，拼出 字符+次数。
 * 2. 整段压完后，长度严格小于原串才返回压缩结果，否则返回原串。
 * 3. 边界 / 易错：长度相等也要返回原串；单字符 "a" 压成 "a1" 更长，返回 "a"。
 */
var compressString = function(S) {
    if (!S) return S;
    let result = '';
    let i = 0;
    while (i < S.length) {
        let j = i;
        while (j < S.length && S[j] === S[i]) j++;
        result += S[i] + (j - i);
        i = j;
    }
    return result.length < S.length ? result : S;
};

console.log(compressString('aabcccccaaa')); // a2b1c5a3
console.log(compressString('abbccd'));      // abbccd
console.log(compressString('a'));           // a

