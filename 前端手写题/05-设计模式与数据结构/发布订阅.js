/**
 * 发布订阅 EventEmitter
 *
 * 需求：实现一个事件中心，支持：
 *   - on(event, fn)         订阅事件
 *   - emit(event, ...args)  触发事件，依次调用所有订阅者
 *   - off(event, fn)        取消某个订阅
 *   - once(event, fn)       只触发一次的订阅
 *
 * ——— 示例 ———
 * 输入： bus.on('msg', fn);  bus.emit('msg', 1);    输出： fn 被调用，打印 got 1
 *        bus.off('msg', fn); bus.emit('msg', 2);    输出： 无（已取消订阅）
 *        bus.once('x', fn);  bus.emit('x'); emit('x'); 输出： fn 只被调用一次
 */

class EventEmitter {
}

// —— 自测 ——
const bus = new EventEmitter();
const fn = (x) => console.log('got', x);
bus.on('msg', fn);
bus.emit('msg', 1); // got 1
bus.off('msg', fn);
bus.emit('msg', 2); // （无输出）

module.exports = { EventEmitter };
