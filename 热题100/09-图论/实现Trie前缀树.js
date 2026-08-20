/**
 * 实现 Trie（前缀树）（LeetCode 208）
 *
 * 请实现一个类 Trie，支持以下操作：
 *   - Trie()               初始化对象。
 *   - insert(word)         向其中插入字符串 word。
 *   - search(word)         若 word 在其中，返回 true；否则返回 false。
 *   - startsWith(prefix)   若之前插入的字符串中存在前缀 prefix，返回 true；否则返回 false。
 * word 和 prefix 仅由小写英文字母组成。
 *
 * ——— 示例 ———
 * 输入：
 *   Trie t = new Trie();
 *   t.insert("apple");
 *   t.search("apple");    // 返回 true
 *   t.search("app");      // 返回 false
 *   t.startsWith("app");  // 返回 true
 *   t.insert("app");
 *   t.search("app");      // 返回 true
 */

class Trie {
  constructor() {
  }

  /**
   * @param {string} word
   * @return {void}
   */
  insert(word) {
  }

  /**
   * @param {string} word
   * @return {boolean}
   */
  search(word) {
  }

  /**
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix) {
  }
}

// —— 自测 ——
const t = new Trie();
t.insert("apple");
console.log(t.search("apple"));   // 期望： true
console.log(t.search("app"));     // 期望： false
console.log(t.startsWith("app")); // 期望： true
t.insert("app");
console.log(t.search("app"));     // 期望： true

module.exports = { Trie };
