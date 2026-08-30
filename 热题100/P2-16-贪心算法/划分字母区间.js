/**
 * 763. 划分字母区间
 *
 * 给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，
 * 同一字母最多出现在一个片段中。
 *
 * 注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 s 。
 *
 * 返回一个表示每个字符串片段的长度的列表。
 *
 * 示例 1：
 * 输入：s = "ababcbacadefegdehijhklij"
 * 输出：[9,7,8]
 * 解释：
 * 划分结果为 "ababcbaca"、"defegde"、"hijhklij" 。
 * 每个字母最多出现在一个片段中。
 * 像 "ababcbacadefegde", "hijhklij" 这样的划分是错误的，因为划分的片段数较少。
 *
 * 示例 2：
 * 输入：s = "eccbbbbdec"
 * 输出：[10]
 *
 * 思路：
 * 1. 先记下每个字母最后出现位置。
 * 2. 从左扫，用 end 扩到当前字母的最后位置；i === end 就切一刀。
 * 3. 边界：切完 start = i+1；同一字母必须落在同一段。
 * 复杂度：时间 O(n)，空间 O(1)
 */

/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
  let last = {};
  for(let i = 0; i < s.length; i++) {
    last[s[i]] = i;
  }

  let end = 0;
  let start = 0;
  const res = [];
  for(let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if(end === i) { // 走到当前段覆盖右端才能切
      res.push(i - start + 1)
      start = i + 1; 
    }
  }
  return res;
};
