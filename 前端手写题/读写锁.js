/**
 * 读写锁 ReadWriteLock（异步）
 *
 * 背景：JS 是单线程，但异步任务会交错。读写锁用来协调并发的异步读/写：
 *   - 读读共享：可以同时有多个"读"在进行；
 *   - 写写互斥：同一时刻只能有一个"写"；
 *   - 读写互斥：有写在进行时，读要等；有读在进行时，写要等所有读结束。
 *
 * 需求：实现一个类，提供以下异步 API（都返回 Promise，拿到锁后 resolve）：
 *   - readLock()    申请读锁（可与其他读锁共存）
 *   - readUnlock()  释放读锁
 *   - writeLock()   申请写锁（独占，需等所有读/写结束）
 *   - writeUnlock() 释放写锁
 *
 * ——— 示例 ———
 * 场景：先并发发起 2 个读（各耗时 100ms），紧接着发起 1 个写。
 *   - 两个读应能"同时"进行（读读共享）；
 *   - 写必须等两个读都结束后才开始（读写互斥）。
 *
 * 期望的执行顺序（时间线）：
 *   read A start
 *   read B start
 *   read A end
 *   read B end
 *   write start      // 等到两个读都结束才开始
 *   write end
 */

class ReadWriteLock {
  
}

// —— 自测（实现后应按上面"期望执行顺序"打印）——
async function demo() {
  const lock = new ReadWriteLock();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function read(name) {
    await lock.readLock();
    console.log(`read ${name} start`);
    await sleep(100);
    console.log(`read ${name} end`);
    lock.readUnlock();
  }

  async function write() {
    await lock.writeLock();
    console.log('write start');
    await sleep(100);
    console.log('write end');
    lock.writeUnlock();
  }

  read('A');
  read('B');
  write();
}

demo();

module.exports = { ReadWriteLock };
