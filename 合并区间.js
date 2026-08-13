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
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const res = [];
    let cmp = intervals[0]
    for(let i = 1; i < intervals.length; i++) {
        const cur = intervals[i];
        if(cmp[1] < cur[0]) {
            res.push(cmp);
            cmp = cur;
            continue;}
        else {
            cmp[1] = Math.max(cur[1], cmp[1]);
        }
    }
    res.push(cmp);
    return res;
};