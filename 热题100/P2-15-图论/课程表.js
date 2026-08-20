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
 */

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
}

// —— 自测 ——
console.log(canFinish(2, [[1, 0]]));         // 期望： true
console.log(canFinish(2, [[1, 0], [0, 1]])); // 期望： false

module.exports = { canFinish };
