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
 */

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, fn) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(fn);
  }

  off(event, fn) {
    const list = this.events[event];
    if (!list) return;
    this.events[event] = list.filter((item) => item !== fn);
  }

  emit(event, ...args) {
    const list = this.events[event];
    if (!list) return;
    // 拷贝一份，emit 中途 off 不影响本次
    const snapshot = list.slice();
    for (let i = 0; i < snapshot.length; i++) {
      snapshot[i](...args);
    }
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    this.on(event, wrapper);
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
