/**
 * 读写锁 ReadWriteLock（异步）
 *
 * 优先级：前端 P2 · 全栈 P1
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
 * 思路：
 * 1. 记当前读计数和是否有写。申请失败就把 resolve 推进等待队列。
 * 2. 读锁：没人写、队列也空着，就可以和别的读共存。
 * 3. 写锁：读计数为 0 且没人写才能拿。释放时按队列唤醒，队头是读就连着放一批读，是写就放一个写。
 * 4. 边界 / 易错：写已经在排队时别再放新的读，否则写可能一直拿不到。
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
 *
 * ——— 延伸 ———
 * - 锁降级：写锁持有者直接 reading++、writing=false，再 wake。读升写要小心死锁（自己还占着读）。
 * - 超时：readLock / writeLock 再包 Promise.race，超时从 waiters 里摘掉。
 * - 写优先：wake 时跳过读去找写。现在是 FIFO，队头是谁就先醒谁。
 *
 * ——— 常见追问 ———
 * Q: 已经有人排队了，为什么新来的读不能直接进？
 * A: 队头可能是写。读再插进去，写会被源源不断的新读堵住，饿死。
 *
 * Q: wake 时队头是读，为什么一口气放完连续的读？
 * A: 读读可共享。放完这一串，直到碰上写或队列空。后面那个写仍要等这批读结束。
 *
 * Q: 写 unlock 后队头还是写，怎么办？
 * A: 只放这一个。写写互斥，不能连放。
 *
 * Q: JS 单线程还要读写锁？
 * A: 单线程挡不住 await 交错。两个读 await 期间，写可能插进来改数据。锁的是这段异步临界区。
 */

class ReadWriteLock {
  constructor() {
    this.reading = 0;
    this.writing = false;
    this.waiters = [];
  }

  readLock() {
    return new Promise((resolve) => {
      const grant = () => {
        this.reading++;
        resolve();
      };
      // 有人写、或已经有人在排队，就不要插队（写会饿死）
      if (!this.writing && this.waiters.length === 0) grant();
      else this.waiters.push({ kind: 'read', grant });
    });
  }

  writeLock() {
    return new Promise((resolve) => {
      const grant = () => {
        this.writing = true;
        resolve();
      };
      if (!this.writing && this.reading === 0 && this.waiters.length === 0) grant();
      else this.waiters.push({ kind: 'write', grant });
    });
  }

  readUnlock() {
    this.reading--;
    this.wake();
  }

  writeUnlock() {
    this.writing = false;
    this.wake();
  }

  wake() {
    if (this.writing || this.waiters.length === 0) return; // 写还占着，谁都别醒
    if (this.waiters[0].kind === 'write') {
      if (this.reading === 0) this.waiters.shift().grant(); // 还有读没完，写继续等
      return; // 就算现在放不了，也不要去放后面的读
    }
    while (this.waiters.length && this.waiters[0].kind === 'read') {
      this.waiters.shift().grant(); // 连续的读一起放行
    }
  }
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
