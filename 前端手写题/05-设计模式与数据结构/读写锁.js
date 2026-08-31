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
    if (this.reading <= 0) throw new Error('当前没有可释放的读锁');
    this.reading--;
    this.wake();
  }

  writeUnlock() {
    if (!this.writing) throw new Error('当前没有可释放的写锁');
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

  /**
   * 延伸 1：自动释放 withRead / withWrite
   *
   * 需求：接收一个异步临界区函数，不论它成功还是抛错都自动释放锁。
   *
   * 思路：await 拿锁后用 try/finally 包住 task，避免调用方漏写 unlock 造成永久死锁。
   *
   * ——— 示例 ———
   * 输入：lock.withWrite(async () => { data.value++ })
   * 输出：任务结束或报错后，写锁都会释放
   */
  async withRead(task) {
    await this.readLock();
    try {
      return await task();
    } finally {
      this.readUnlock();
    }
  }

  async withWrite(task) {
    await this.writeLock();
    try {
      return await task();
    } finally {
      this.writeUnlock();
    }
  }

  /**
   * 延伸 2：写锁降级为读锁
   *
   * 需求：持有写锁的任务更新完数据后，继续以读锁身份查看数据，期间允许其他读者进入。
   *
   * 思路：先把 reading 加一，再释放 writing，整个切换没有无锁空窗；随后 wake 连续读者。
   */
  downgrade() {
    if (!this.writing) throw new Error('只有写锁持有者才能降级');
    this.reading++;
    this.writing = false;
    this.wake();
  }
}

/**
 * 延伸 3：带超时的锁申请
 *
 * 需求：等待超过 timeout 毫秒就拒绝，并把 waiter 从队列删除，不能留下稍后误获锁的幽灵请求。
 *
 * 思路：超时回调用 indexOf 找到自己的 waiter 并 splice；grant 时清 timer 并正常计数。
 */
class ReadWriteLockWithTimeout extends ReadWriteLock {
  _lockWithTimeout(kind, timeout) {
    return new Promise((resolve, reject) => {
      let settled = false;
      let timer;
      const waiter = {
        kind,
        grant: () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (kind === 'read') this.reading++;
          else this.writing = true;
          resolve();
        },
      };

      const canRead = kind === 'read' && !this.writing && this.waiters.length === 0;
      const canWrite = kind === 'write' && !this.writing
        && this.reading === 0 && this.waiters.length === 0;
      if (canRead || canWrite) {
        waiter.grant();
        return;
      }

      this.waiters.push(waiter);
      timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        const index = this.waiters.indexOf(waiter);
        if (index >= 0) this.waiters.splice(index, 1);
        const error = new Error(`等待${kind === 'read' ? '读' : '写'}锁超时`);
        error.name = 'TimeoutError';
        reject(error);
        this.wake();
      }, timeout);
    });
  }

  readLockWithTimeout(timeout) {
    return this._lockWithTimeout('read', timeout);
  }

  writeLockWithTimeout(timeout) {
    return this._lockWithTimeout('write', timeout);
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

module.exports = { ReadWriteLock, ReadWriteLockWithTimeout };
