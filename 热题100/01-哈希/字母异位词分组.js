/**
 * 字母异位词分组（LeetCode 49）
 *
 * 给定一个字符串数组 strs，将其中互为字母异位词的字符串组合在一起。
 * 返回一个数组，数组中的每个元素是一组互为字母异位词的字符串。答案可以按任意顺序返回。
 * 字母异位词是指由相同字母（含出现次数）以不同顺序排列组成的字符串。
 * strs[i] 仅包含小写字母，允许出现空字符串。
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
 */

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // TODO
}

// —— 自测 ——
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])); // [["bat"],["nat","tan"],["ate","eat","tea"]]（顺序不限）
console.log(groupAnagrams([""]));                                       // [[""]]
console.log(groupAnagrams(["a"]));                                      // [["a"]]

module.exports = { groupAnagrams };
