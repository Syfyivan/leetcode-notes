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
 *
 * 思路：
 * 1. 每个节点挂 26 叉子节点，isEnd 标记是否成词。
 * 2. insert 沿字符建节点，末尾打 isEnd。
 * 3. 边界：search 必须走到 isEnd；startsWith 走到即可。
 * 复杂度：时间 O(L)，空间 O(节点数)
 *
 * ——— 延伸 ———
 * - 删除单词：节点加计数，删到 0 再收空枝。
 * - 通配符 '.'：当前层 DFS 26 个儿子。
 * - 字符集大：用 Map 代替对象字段。
 *
 * ——— 常见追问 ———
 * Q: search 和 startsWith 差在哪？
 * A: 都要走到对应节点。search 还要求 isEnd，否则只是别人的前缀。
 *
 * Q: 为什么需要 isEnd？
 * A: 插了 apple，app 这条路径存在，但 app 还不成词。没标记就会误判。
 *
 * Q: 空串？
 * A: insert("") 会在 root 打 isEnd。search("") 看 root.isEnd。
 *
 * Q: 空间怎么估？
 * A: 最坏每个字符新建节点，O(所有单词长度之和)。前缀共享会少很多。
 */

class Trie {
  constructor() {
    this.root = {};
  }

  /**
   * @param {string} word
   * @return {void}
   */
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node.isEnd = true; // 路径在不代表成词，末尾必须打标
  }

  _walk(s) {
    let node = this.root;
    for (const ch of s) {
      if (!node[ch]) return null;
      node = node[ch];
    }
    return node;
  }

  /**
   * @param {string} word
   * @return {boolean}
   */
  search(word) {
    const node = this._walk(word);
    return !!node && !!node.isEnd; // 前缀在不代表单词在
  }

  /**
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix) {
    return !!this._walk(prefix);
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
