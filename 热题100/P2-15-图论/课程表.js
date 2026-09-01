/**
 * 热题 100 · 课程表
 *
 * 优先级：Hot 100 · P2
 */

/**
 * 课程表（LeetCode 207）
 *
 * 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1。
 * 在选修某些课程之前需要一些先修课程。先修课程按数组 prerequisites 给出，
 * 其中 prerequisites[i] = [ai, bi]，表示如果要学习课程 ai 则必须先学习课程 bi。
 *   例如，先修课程对 [0, 1] 表示：想要学习课程 0，你需要先完成课程 1。
 * 请判断是否可能完成所有课程的学习？如果可以，返回 true；否则，返回 false。
 *
 * ——— 示例 ———
 * 输入： numCourses = 2, prerequisites = [[1,0]]
 * 输出： true
 *
 * 输入： numCourses = 2, prerequisites = [[1,0],[0,1]]
 * 输出： false
 *
 * 思路：
 * 1. 建图并统计入度，入度为 0 的课入队。
 * 2. 拓扑弹出一门，邻接课入度减一，减到 0 再入队。
 * 3. 边界：弹出数量等于课程数则可修完，否则有环。
 * 复杂度：时间 O(n+e)，空间 O(n+e)
 *
 * ——— 延伸 ———
 * - 课程表 II：弹出顺序就是一种合法修课顺序。
 * - DFS 三色：访问中再碰到自己，说明有环。
 * - 队列换成栈：拓扑序不同，能不能修完结论一样。
 *
 * ——— 常见追问 ———
 * Q: 入度 0 是什么？
 * A: 没有先修，现在就能学。作为拓扑起点。
 *
 * Q: 有环怎么看出来？
 * A: 环上的点入度永远减不完，出队数量小于课程数。
 *
 * Q: 没有先修课？
 * A: 所有课入度 0，一次性全进队，taken == n，返回 true。
 *
 * Q: 多门课同时可修？
 * A: 入度 0 的可以按任意顺序出队。本题只问能不能修完，不问并行学期数。
 */

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
    const graph = Array.from({ length: numCourses }, () => []);
    const indeg = new Array(numCourses).fill(0);
    for (const [ai, bi] of prerequisites) {
        graph[bi].push(ai); // 边方向：先修 bi 指向后修 ai
        indeg[ai]++;
    }
    const q = [];
    for (let i = 0; i < numCourses; i++) {
        if (indeg[i] === 0) q.push(i);
    }
    let taken = 0;
    let head = 0;
    while (head < q.length) {
        const cur = q[head++];
        taken++;
        for (const nxt of graph[cur]) {
            indeg[nxt]--;
            if (indeg[nxt] === 0) q.push(nxt);
        }
    }
    return taken === numCourses; // 少了说明有环
}

/**
 * 延伸 1：返回一种合法的修课顺序
 *
 * 需求：若能完成全部课程，返回任意一种拓扑顺序；若存在环，返回空数组。
 *
 * 思路：复用 Kahn 拓扑排序，把每次出队课程依次写入 order，最后检查数量是否完整。
 *
 * ——— 示例 ———
 * 示例：findOrder(2, [[1,0]]) => [0,1]
 *
 * 复杂度：时间 O(n+e)，空间 O(n+e)
 */
function findOrder(numCourses, prerequisites) {
    const graph = Array.from({ length: numCourses }, () => []);
    const indegree = new Array(numCourses).fill(0);
    for (const [course, prerequisite] of prerequisites) {
        graph[prerequisite].push(course);
        indegree[course]++;
    }

    const queue = [];
    for (let course = 0; course < numCourses; course++) {
        if (indegree[course] === 0) queue.push(course);
    }

    const order = [];
    let head = 0;
    while (head < queue.length) {
        const course = queue[head++];
        order.push(course);
        for (const next of graph[course]) {
            if (--indegree[next] === 0) queue.push(next);
        }
    }
    return order.length === numCourses ? order : [];
}

// —— 自测 ——
console.log(canFinish(2, [[1, 0]]));         // 期望： true
console.log(canFinish(2, [[1, 0], [0, 1]])); // 期望： false
console.log(findOrder(2, [[1, 0]]));          // 期望： [0,1]

module.exports = { canFinish, findOrder };
