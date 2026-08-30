/**
 * 前 K 个高频元素（LeetCode 347）
 *
 * 给你一个整数数组 nums 和一个整数 k，请你返回其中出现频率前 k 高的元素。
 * 你可以按任意顺序返回答案。
 *
 * ——— 示例 ———
 * 输入： nums = [1,1,1,2,2,3], k = 2
 * 输出： [1,2]
 *
 * 输入： nums = [1], k = 1
 * 输出： [1]
 *
 * 思路：
 * 1. 哈希统计频率。
 * 2. 用大小为 k 的小根堆，只留频率最高的 k 个。
 * 3. 边界：堆满时只替换比堆顶更频的；答案顺序任意。
 * 复杂度：时间 O(n log k)，空间 O(n)
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function topKFrequent(nums, k) {
    const freq = new Map();
    for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);

    const heap = []; // [freq, num]，小根堆
    const less = (i, j) => heap[i][0] < heap[j][0];
    const swap = (i, j) => {
        const t = heap[i];
        heap[i] = heap[j];
        heap[j] = t;
    };
    const up = (i) => {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (!less(i, p)) break;
            swap(i, p);
            i = p;
        }
    };
    const down = (i) => {
        const n = heap.length;
        while (true) {
            let m = i;
            const l = i * 2 + 1;
            const r = l + 1;
            if (l < n && less(l, m)) m = l;
            if (r < n && less(r, m)) m = r;
            if (m === i) break;
            swap(i, m);
            i = m;
        }
    };

    for (const [num, f] of freq) {
        if (heap.length < k) {
            heap.push([f, num]);
            up(heap.length - 1);
        } else if (f > heap[0][0]) { // 只替换堆顶更小的
            heap[0] = [f, num];
            down(0);
        }
    }
    return heap.map((x) => x[1]);
}

// —— 自测 ——
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1,2]
console.log(topKFrequent([1], 1)); // [1]

module.exports = { topKFrequent };
