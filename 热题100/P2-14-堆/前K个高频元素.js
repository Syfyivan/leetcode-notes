/**
 * 热题 100 · 前K个高频元素
 *
 * 优先级：Hot 100 · P2
 */

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
 *
 * ——— 延伸 ———
 * - 桶排序：频率当下标，从高往低收 k 个，最坏 O(n)。
 * - 大根堆：全部入堆再弹 k 次，O(n log n)，k 接近 n 时也行。
 * - 要按频率排序输出：弹出后再排一次。
 *
 * ——— 常见追问 ———
 * Q: 为什么用小根堆？
 * A: 堆顶是这 k 个里最不频的。新来的更大就替换顶，始终留着最高的 k 个。
 *
 * Q: 频率相同怎么办？
 * A: 题目允许任意顺序。堆比较只看频率即可。
 *
 * Q: k 等于不同数字个数？
 * A: 堆装不下才会替换，此时全部留下，直接 map 出答案。
 *
 * Q: 和快选比？
 * A: 快选平均 O(n)，但要改数组、最坏 n^2。堆更稳，k 很小时 log k 很小。
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

/**
 * 延伸 1：桶排序求前 K 个高频元素
 *
 * 需求：不使用堆，利用“元素出现次数不会超过数组长度”把平均时间降到 O(n)。
 *
 * 思路：先统计频率，再把数字放进下标等于频率的桶中，最后从高频桶向低频桶收集 k 个数字。
 *
 * ——— 示例 ———
 * 示例：topKFrequentBucket([1,1,1,2,2,3], 2) => [1,2]
 *
 * 复杂度：时间 O(n)，空间 O(n)
 */
function topKFrequentBucket(nums, k) {
    const freq = new Map();
    for (const num of nums) freq.set(num, (freq.get(num) || 0) + 1);

    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [num, count] of freq) buckets[count].push(num);

    const result = [];
    for (let count = buckets.length - 1; count >= 0 && result.length < k; count--) {
        for (const num of buckets[count]) {
            result.push(num);
            if (result.length === k) break;
        }
    }
    return result;
}

// —— 自测 ——
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1,2]
console.log(topKFrequent([1], 1)); // [1]
console.log(topKFrequentBucket([1, 1, 1, 2, 2, 3], 2)); // [1,2]

module.exports = { topKFrequent, topKFrequentBucket };
