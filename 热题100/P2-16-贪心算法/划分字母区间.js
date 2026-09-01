/**
 * 热题 100 · 划分字母区间
 *
 * 优先级：Hot 100 · P2
 */

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
 *
 * ——— 延伸 ———
 * - 题目要尽量多段：贪心每到 end 就切，段数自然最多。
 * - 返回子串本身：slice(start, i+1) 代替长度。
 * - 字符集不止小写：用 Map 记最后位置。
 *
 * ——— 常见追问 ———
 * Q: 为什么先扫最后出现位置？
 * A: 一个字母一旦出现，这段至少要覆盖到它最后一次。end 只能扩不能缩。
 *
 * Q: 为什么 i === end 才切？
 * A: 走到当前段承诺的右端，里面的字母都覆盖完了，再切不会把同一字母拆开。
 *
 * Q: 一个字母贯穿全串？
 * A: end 会一直是最后一格，只能切出一段，长度 n。
 *
 * Q: 全是不同字母？
 * A: 每个字母 last 就是自己，每步都切，答案全是 1。
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

/**
 * 延伸 1：返回每个分段的范围与内容
 *
 * 需求：除分段长度外，返回每段的起止下标和对应子串，方便还原实际划分结果。
 *
 * 思路：切分时不只记录长度，同时保存当前 start、end，并用 slice 取得片段内容。
 *
 * ——— 示例 ———
 * 示例：partitionLabelRanges("abac") => [{start:0,end:2,text:"aba"},{start:3,end:3,text:"c"}]
 *
 * 复杂度：时间 O(n)，返回子串占用空间 O(n)
 */
function partitionLabelRanges(s) {
  const last = new Map();
  for (let i = 0; i < s.length; i++) last.set(s[i], i);

  const result = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i]));
    if (i === end) {
      result.push({ start, end, text: s.slice(start, end + 1) });
      start = i + 1;
    }
  }
  return result;
}

// —— 自测 ——
console.log(partitionLabels("ababcbacadefegdehijhklij")); // 期望：[9,7,8]
console.log(partitionLabelRanges("abac")); // 期望：aba、c 两段

module.exports = { partitionLabels, partitionLabelRanges };
