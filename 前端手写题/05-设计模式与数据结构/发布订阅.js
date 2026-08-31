/**
 * 发布订阅 EventEmitter
 *
 * 优先级：前端 P1 · 全栈 P1
 *
 * 需求：实现一个事件中心，支持：
 *   - on(event, fn)         订阅事件
 *   - emit(event, ...args)  触发事件，依次调用所有订阅者
 *   - off(event, fn)        取消某个订阅
 *   - once(event, fn)       只触发一次的订阅
 *
 * 思路：
 * 1. 用对象存事件名到回调数组。on 推进数组，off 按函数引用滤掉。
 * 2. emit 先浅拷贝再调，遍历中途 off 不影响这一轮。
 * 3. once 包一层：先 off 自己再调原函数。
 * 4. 边界 / 易错：不拷贝的话，emit 时 off 会让后面的监听漏掉或下标错乱。
 *
 * ——— 示例 ———
 * 输入： bus.on('msg', fn);  bus.emit('msg', 1);    输出： fn 被调用，打印 got 1
 *        bus.off('msg', fn); bus.emit('msg', 2);    输出： 无（已取消订阅）
 *        bus.once('x', fn);  bus.emit('x'); emit('x'); 输出： fn 只被调用一次
 *
 * ——— 常见追问 ———
 * Q: emit 为什么要 slice？
 * A: 遍历时一旦 off / on，原数组长度会变，后面的监听可能被跳过或重复调。
 *    拷一份，这一轮认这一轮的名单。
 *
 * Q: once 为什么 off 的是 wrapper？
 * A: 数组里存的是 wrapper。off(event, fn) 按引用比，原函数对不上，清不掉。
 *
 * Q: 同一个 fn 注册两次，off 一次会怎样？
 * A: filter 两次都滤掉。要只摘一个，得 indexOf + splice。
 *
 * Q: 监听里再 emit 同一个事件会不会死循环？
 * A: 会。slice 只挡名单变动，挡不住同步递归 emit。once 或 setTimeout 把 emit 推走才能破。
 */

class EventEmitter {
  constructor() {
    this.events = Object.create(null); // '__proto__' 等字符串也能安全作为事件名
  }

  on(event, fn) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(fn);
    return () => this.off(event, fn); // 组件卸载时可直接调用返回的取消函数
  }

  off(event, fn) {
    const list = this.events[event];
    if (!list) return;
    if (fn === undefined) {
      delete this.events[event];
      return;
    }
    this.events[event] = list.filter(
      (item) => item !== fn && item.original !== fn
    );
    if (this.events[event].length === 0) delete this.events[event];
  }

  emit(event, ...args) {
    const list = this.events[event];
    if (!list) return;
    // 拷一份，emit 中途 off 不影响本轮下标
    const snapshot = list.slice();
    for (let i = 0; i < snapshot.length; i++) {
      snapshot[i](...args);
    }
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper); // 名单里是 wrapper，摘原 fn 对不上
      fn(...args);
    };
    wrapper.original = fn; // off(event, 原函数) 也能找到 once 包装层
    this.on(event, wrapper);
  }

  /**
   * 延伸 1：prepend / 清空 / 监听数量
   *
   * 需求：prepend 把监听放到队首；off(event) 清空整个事件；listenerCount 用于排查重复订阅。
   *
   * 思路：prepend 用 unshift，其余都复用 events 中保存的监听数组。
   *
   * ——— 示例 ———
   * 输入：on('x', second); prepend('x', first); emit('x')
   * 输出：first 先于 second 执行
   */
  prepend(event, fn) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].unshift(fn);
    return () => this.off(event, fn);
  }

  listenerCount(event) {
    return this.events[event]?.length || 0;
  }

  removeAllListeners(event) {
    if (event === undefined) this.events = Object.create(null);
    else delete this.events[event];
  }

  /**
   * 延伸 2：错误隔离 emitSafe
   *
   * 需求：一个监听抛错时继续执行后面的监听，并把所有错误交给调用方处理。
   *
   * 思路：仍遍历快照，但每个监听各自 try/catch，最后返回 errors 数组。
   *
   * ——— 示例 ———
   * 输入：第一个监听 throw，第二个监听正常；emitSafe('x')
   * 输出：第二个仍执行，返回数组中包含第一个错误
   */
  emitSafe(event, ...args) {
    const snapshot = this.events[event]?.slice() || [];
    const errors = [];
    for (const listener of snapshot) {
      try {
        listener(...args);
      } catch (error) {
        errors.push(error);
      }
    }
    return errors;
  }
}

// —— 自测 ——
const bus = new EventEmitter();
const fn = (x) => console.log('got', x);
bus.on('msg', fn);
bus.emit('msg', 1); // got 1
bus.off('msg', fn);
bus.emit('msg', 2); // （无输出）

module.exports = { EventEmitter };
