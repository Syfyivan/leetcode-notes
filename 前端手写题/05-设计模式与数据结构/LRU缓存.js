/**
 * LRU 缓存（Least Recently Used）
 *
 * 优先级：前端 P2 · 全栈 P1
 *
 * 需求：实现一个固定容量的缓存，支持 get / put：
 *   - get(key)：存在则返回值，并把该 key 标记为"最近使用"；不存在返回 -1。
 *   - put(key, value)：写入/更新；若超出容量，淘汰"最久未使用"的那个 key。
 *   - get 和 put 都算一次"使用"，会刷新该 key 的新鲜度。
 *
 * 两套写法，行为一致，面试都能过：
 *   LRUCache         方案一：直接用 Map 的插入顺序（前端常写）
 *   LRUCacheLinked   方案二：哈希表 + 手写双向链表（LC 146 标准答案）
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
 *
 * ——— 延伸 ———
 * - delete(key)：名册删、链表抽出。有这个方法才像真缓存。
 * - TTL：节点再带 expireAt，get 时过期当 miss，顺手删。
 * - LFU：按次数淘汰。哈希 + 频次桶（每个次数一条链表），比 LRU 重一档。
 * - 为什么不用普通对象当名册：数字键会被排序，"最旧"会乱。
 *
 * ——— 常见追问 ———
 * Q: 为什么哈希还要再加一条链表？
 * A: 哈希只能 O(1) 点名，不知道谁最久没被摸。链表左边最旧、右边最新，
 *    抽出/接到队尾都是改指针。两套钉在一起，get/put 才都是 O(1)。
 *
 * Q: JS 的 Map 底层就是哈希 + 双向链表吗？
 * A: 不是。规范只保证插入顺序。V8 是有序哈希表：一块桶做查找，
 *    一块数组按插入序排。delete 再 set 等于在数组末尾再写一条，
 *    看起来像挪到最新。手写链表才能 O(1) 剪指针。
 *
 * Q: 哈希的 value 为什么必须是节点？链表 value 指向哈希行不行？
 * A: get 手里只有 key，既要取值，又要把这个人拉到队尾。名册指向节点，
 *    一次查找两件事都齐。链表不会按 key 找人，反过来会退化成 O(n)。
 *
 * Q: 节点上为什么还要存 key？
 * A: 满了踢的是 head.next 这个节点。名册是 key -> 节点，反着查没有。
 *    工号写在节点上，才能 map.delete(oldest.key)。
 *
 * Q: 容量为 0 / 只 put 不 get 怎么办？
 * A: capacity 0 每次 put 完立刻把自己踢掉。只 put 也按写入刷新新鲜度。
 */

// ============================================================
// 方案一：Map 插入顺序
//
// 思路：
// 1. Map 按插入顺序排列，队头是最早插入、也就是最久没刷新的。
// 2. get / put 命中时先 delete 再 set，这条记录会被挪到最末尾，变成最近使用。
// 3. put 新 key 且已满：keys().next() 取出队头删掉，再 set 新的。
// 4. 边界 / 易错：更新已有 key 也要先删再设，否则顺序不会变，稍后可能误删它。
// ============================================================

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // 只用插入序，当「左旧右新」的队列
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // 删再插，排到最末尾 = 最近使用
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key); // 已有 key：先摘掉，下面 set 才会到队尾
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value; // 迭代器第一个 = 最旧
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

// ============================================================
// 方案二：哈希表 + 双向链表
//
// 思路：
// 1. Map 只当哈希名册：key -> 链表节点，O(1) 点名。新旧顺序全由链表管。
// 2. 链表左旧右新。头、尾是空门岗，真数据夹中间。最旧是 head.next，最新是 tail.prev。
// 3. 被用过：从原位抽出，接到尾巴前面。满了：踢掉头门岗右边那个，名册同步删。
// 4. 节点上必须存 key。踢人时链表只给你节点，名册要靠这个 key 才能划掉对应项。
// 5. 边界 / 易错：更新已有 key 也要挪到最新；先插入再淘汰，别先踢错人。
// ============================================================

class Node {
  constructor(key, value) {
    this.key = key;     // 踢人时要拿去名册里划掉
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCacheLinked {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // 名册：key -> 节点。不用 Map 的插入序
    this.head = new Node(0, 0); // 空门岗，不当缓存数据
    this.tail = new Node(0, 0);
    this.head.next = this.tail; // 空链表：两堵墙互相拉手
    this.tail.prev = this.head;
  }

  // 抽出：左右两家握手，这个节点暂时没人牵
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // 接到尾巴前面 = 变成最新
  _addToTail(node) {
    const last = this.tail.prev;
    last.next = node;
    node.prev = last;
    node.next = this.tail;
    this.tail.prev = node;
  }

  _moveToTail(node) {
    this._remove(node);
    this._addToTail(node);
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key); // 名册 O(1) 拿到节点，不用沿链表扫
    this._moveToTail(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._moveToTail(node); // 更新也算用过
      return;
    }

    const node = new Node(key, value);
    this.map.set(key, node);
    this._addToTail(node);

    if (this.map.size > this.capacity) {
      const oldest = this.head.next; // 门岗右边那个就是最旧
      this._remove(oldest);
      this.map.delete(oldest.key); // 链表和名册必须一起删
    }
  }
}

function runExample(label, Cache) {
  const cache = new Cache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  const out = [];
  out.push(cache.get(1)); // 1
  cache.put(3, 3);
  out.push(cache.get(2)); // -1
  cache.put(4, 4);
  out.push(cache.get(1)); // -1
  out.push(cache.get(3)); // 3
  out.push(cache.get(4)); // 4
  console.log(label, out.join(', '));
}

// —— 自测（对照上面示例，两套都应打印 1, -1, -1, 3, 4）——
runExample('Map', LRUCache);
runExample('哈希+链表', LRUCacheLinked);

module.exports = { LRUCache, LRUCacheLinked, Node };
