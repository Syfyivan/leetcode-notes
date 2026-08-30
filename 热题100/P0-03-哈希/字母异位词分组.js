/**
 * 字母异位词分组（LeetCode 49）
 *
 * 给定一个字符串数组 strs，将其中互为字母异位词的字符串组合在一起。
 * 返回一个数组，数组中的每个元素是一组互为字母异位词的字符串。答案可以按任意顺序返回。
 * 字母异位词是指由相同字母（含出现次数）以不同顺序排列组成的字符串。
 * strs[i] 仅包含小写字母，允许出现空字符串。
 *
 * 思路：
 * 1. 异位词排序后是同一个串，拿排序结果当 key。
 * 2. map 里按 key 把原串推进同一个数组，最后取出所有数组。
 * 3. 边界：空串、单字母也能当 key，单独成一组。
 * 复杂度：时间 O(n * k log k)，空间 O(n k)，k 是最长串长度
 *
 * ——— 示例 ———
 * 输入： strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 * 输出： [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
 *
 * 输入： strs = [""]
 * 输出： [[""]]
 *
 * 输入： strs = ["a"]
 * 输出： [["a"]]
 *
 * ——— 延伸 ———
 * - 计数当 key：26 个计数拼成 "a2b1..."，时间 O(n k)，省掉 sort。
 * - 质数相乘当指纹：26 字母对 26 质数，积相同即异位。溢出要小心。
 * - 判断两个串是不是异位词：计数一次，O(k)。
 *
 * ——— 常见追问 ———
 * Q: 为什么排序能当 key？
 * A: 异位词字母和次数都一样，sort 后必然同一串。组成不同，sort 后必不同。
 *
 * Q: 大写 / Unicode 怎么办？
 * A: 题目只有小写。有大写先 toLowerCase。非 ASCII 别用 26 桶，改 Map 计数。
 *
 * Q: 空串为什么单独一组？
 * A: 空串 sort 还是 ""，所有空串进同一组。
 *
 * Q: 输出顺序有要求吗？
 * A: 没有。组内组间都任意。Map 插入序是第一次遇到该 key 的顺序。
 */

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join(''); // 异位词排序后同一 key
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}

// —— 自测 ——
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])); // [["bat"],["nat","tan"],["ate","eat","tea"]]（顺序不限）
console.log(groupAnagrams([""]));                                       // [[""]]
console.log(groupAnagrams(["a"]));                                      // [["a"]]

module.exports = { groupAnagrams };
