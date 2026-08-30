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
 * ——— 延伸 ———
 * - off(event) 不传 fn：清空这个事件的全部监听。组件卸载常用。
 * - 错误隔离：某个 fn throw，try/catch 包住，别让后面的监听歇菜。Node 的 'error' 没人听会自己抛。
 * - prepend：unshift 到数组头，让某些监听先跑（Node 有 prependListener）。
 * - once 用 Map 记 fn -> wrapper。否则 off(event, 原fn) 对不上引用，once 的清不掉。
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
    this.events = {};
  }

  on(event, fn) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(fn);
  }

  off(event, fn) {
    const list = this.events[event];
    if (!list) return;
    this.events[event] = list.filter((item) => item !== fn); // 按引用删，箭头函数每次都是新的
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
