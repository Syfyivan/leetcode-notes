/**
 * 热题 100 · 合并区间
 *
 * 优先级：Hot 100 · P1
 */

// /**
//  * @param {number[][]} intervals
//  * @return {number[][]}
//  */
// var merge = function(intervals) {
//     intervals.sort((a, b) => a[0] - b[0]);
//     const len = intervals.length;
//     let res = [];
//     let prev = intervals[0];
//     for(let i = 0; i < len; i++) {
//         let cur = intervals[i];
//         if(cur[0] <= prev[1]) {
//             prev[1] = Math.max(prev[1], cur[1]);
//             continue;
//         } else {
//             res.push(prev); 
//             prev = cur;
//         }
//     }
//     res.push(prev);
//     return res;
// };




// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

 

// 示例 1：

// 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
// 输出：[[1,6],[8,10],[15,18]]
// 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].


/**
 * 思路：
 * 1. 按区间左端点排序。
 * 2. 当前区间和上一组合并段重叠，就延长右端；否则把上一段推进答案，换新段。
 * 3. 边界：最后一个合并段循环结束后还要推进答案。
 * 复杂度：时间 O(n log n)，空间 O(n)
 *
 * ——— 延伸 ———
 * - 插入区间（LC 57）：新区间按序插入后再合并。
 * - 区间覆盖最短段：贪心按右端排。
 * - 合并后求总覆盖长度：扫一遍减重叠。
 *
 * ——— 常见追问 ———
 * Q: 为什么按左端排序？
 * A: 排完只需跟「当前合并段」比。左端还在段内就重叠，否则可以封口。
 *
 * Q: 重叠条件 cmp[1] < cur[0]？
 * A: 当前段右端够不到新区间左端，断开。相等算重叠（闭区间）。
 *
 * Q: 循环结束后为什么还 push？
 * A: 最后一段没人把它推走，要补一次。
 *
 * Q: 原地改行不行？
 * A: 行，用答案数组当写指针。注意别覆盖还没处理的区间。
 *
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]); // 按左端排，后面只需跟当前段比
    const res = [];
    let cmp = intervals[0]
    for(let i = 1; i < intervals.length; i++) {
        const cur = intervals[i];
        if(cmp[1] < cur[0]) { // 闭区间，相等也算重叠
            res.push(cmp);
            cmp = cur;
            continue;}
        else {
            cmp[1] = Math.max(cur[1], cmp[1]);
        }
    }
    res.push(cmp); // 最后一段没人推，补一次
    return res;
};

/**
 * 延伸 1：插入区间（LeetCode 57）
 *
 * 需求：原区间已按起点排序且互不重叠，插入新区间后仍返回有序不重叠结果。
 *
 * 思路：先收左侧无交集区间，再合并所有相交区间，最后接上右侧剩余区间。
 *
 * ——— 示例 ———
 * 示例：[[1,3],[6,9]] 插入 [2,5]，输出 [[1,5],[6,9]]。
 *
 * 复杂度：时间 O(n)，结果空间 O(n)。
 */
function insertInterval(intervals, newInterval) {
  const result = [];
  let index = 0;
  while (index < intervals.length && intervals[index][1] < newInterval[0]) {
    result.push(intervals[index++]);
  }
  let merged = newInterval.slice();
  while (index < intervals.length && intervals[index][0] <= merged[1]) {
    merged[0] = Math.min(merged[0], intervals[index][0]);
    merged[1] = Math.max(merged[1], intervals[index][1]);
    index++;
  }
  result.push(merged);
  return result.concat(intervals.slice(index));
}

// —— 自测 ——
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));

module.exports = { merge, insertInterval };
