/**
 * LRU 缓存（Least Recently Used）
 *
 * 需求：实现一个固定容量的缓存，支持 get / put：
 *   - get(key)：存在则返回值，并把该 key 标记为"最近使用"；不存在返回 -1。
 *   - put(key, value)：写入/更新；若超出容量，淘汰"最久未使用"的那个 key。
 *   - get 和 put 都算一次"使用"，会刷新该 key 的新鲜度。
 *
 * ——— 示例（容量 = 2）———
 * put(1, 1)              缓存: {1=1}
 * put(2, 2)              缓存: {1=1, 2=2}
 * get(1)   -> 1          缓存: {2=2, 1=1}   （1 变成最近使用）
 * put(3, 3)             淘汰最久未用的 2    缓存: {1=1, 3=3}
 * get(2)   -> -1        （2 已被淘汰）
 * put(4, 4)            淘汰最久未用的 1    缓存: {3=3, 4=4}
 * get(1)   -> -1
 * get(3)   -> 3
 * get(4)   -> 4
 */

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if(!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if(this.cache.has(key)) {
      this.cache.delete(key);
    } else if(this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey)
    } 
     this.cache.set(key, value);
  }
}

// —— 自测（对照上面示例，逐行应打印 1, -1, -1, 3, 4）——
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3);
console.log(cache.get(2)); // -1
cache.put(4, 4);
console.log(cache.get(1)); // -1
console.log(cache.get(3)); // 3
console.log(cache.get(4)); // 4

module.exports = { LRUCache };
