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
 *
 * ——— 示例 ———
 * 输入： 'aabcccccaaa'    输出： 'a2b1c5a3'
 * 输入： 'abbccd'         输出： 'abbccd'（压完 'a1b2c2d1' 没变短）
 * 输入： 'a'              输出： 'a'
 *
 * ——— 延伸 ———
 * - 原地压缩（LC 443）：写指针覆盖原数组，返回新长度。面试常从这题拐过去。
 * - 解压：扫「字母 + 数字」，数字可能多位，要一次读完。
 * - 只压连续段：头尾两个 a 不能合成 a5。全局计数会毁掉原串结构。
 *
 * ——— 常见追问 ———
 * Q: 长度相等为什么还要返回原串？
 * A: 题目要「严格变短」。相等说明没省空间，还多了一套编解码，原串更干净。
 *
 * Q: 为什么双指针，不直接数一遍？
 * A: 连续相同才合并。全局计数会把头尾两个 a 合成 a5，位置信息没了。
 *
 * Q: 空串 / 全相同怎么办？
 * A: 空串原样返回。'aaaaa' 压成 'a5'，更短就返回压缩结果。
 *
 * Q: 次数大于 9 要不要特殊处理？
 * A: 这题不用。次数直接拼进去，'a12' 三个字符。解压时才要处理多位数字。
 */
var compressString = function(S) {
    if (!S) return S; // 空串压不了，原样走
    let result = '';
    let i = 0;
    while (i < S.length) {
        let j = i;
        while (j < S.length && S[j] === S[i]) j++;
        result += S[i] + (j - i); // 这一段的字符和次数
        i = j; // 跳到下一段起点
    }
    return result.length < S.length ? result : S; // 没严格变短就回原串
};

console.log(compressString('aabcccccaaa')); // a2b1c5a3
console.log(compressString('abbccd'));      // abbccd
console.log(compressString('a'));           // a

