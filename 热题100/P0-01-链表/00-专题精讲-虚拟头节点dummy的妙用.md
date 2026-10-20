# 专题精讲 · 链表中的“减负神器”——虚拟头节点（dummy）

> **作者寄语**：刚学链表时，你一定经常被 `TypeError: Cannot read properties of null (reading 'next')` 搞得头皮发麻。虚拟头节点（`dummy` / 哨兵节点）就是专门用来彻底解决这个痛点的！

---

## 💡 一、 形象比喻：链表就像「排队拉手」

链表里的每个节点，就像一排排队的小朋友：
* 每个人都用右手**拉着后面一个人的衣服**（这就是 `.next`）。
* 但**排在第 1 位的小朋友（`head`）最特殊**——他前面是空气（`null`），**没有任何人拉着他**！

```text
普通链表结构：
[空气 null] ──> [节点 1 (head)] ──> [节点 2] ──> [节点 3] ──> null
```

### 什么是 `dummy` 节点？
`dummy` 就是你在队伍最前面放的一个**“假人领队”**。这个假人不存储业务数据（值通常随便写个 0），但他真实存在，并且**一伸手就拉着第 1 个真正的小朋友**：

```text
加上 dummy 后的结构：
[dummy (假人)] ──next──> [节点 1 (head)] ──next──> [节点 2] ──next──> [节点 3] ──next──> null
```

**创建代码模板：**
```javascript
const dummy = new ListNode(0, head); // dummy.next 指向真正的 head
```

---

## ❓ 二、 为什么必须用 dummy？（两大核心原因）

### 原因 1：防止程序崩溃报错（最关键）
* 在 JavaScript / 所有编程语言中，`null` 就是空气。
* 如果你写 `null.next = xxx`，程序会**直接崩溃报错**。
* `dummy` 是一个真实创建的 JavaScript 对象（`new ListNode(...)`），对它做 `dummy.next = xxx` **永远绝对安全，绝不报错！**

### 原因 2：消灭繁琐的 `if / else` 特判，统一代码逻辑
* 单链表删除或插入节点，核心是找到目标节点的**前驱节点（前一个人）**。
* 如果不加 dummy，中间节点的前驱是上一个真实节点，但第 1 个节点的前驱是 `null`，你就必须写大量的 `if (isHead) { ... } else { ... }` 分支。
* 加了 dummy 后，**每个节点（包括第 1 个节点）都有了合法的实体前驱**，一套代码打通所有情况！

---

## 🎯 三、 什么时候必须用 dummy？（三大核心场景）

| 核心场景 | 生活场景比喻 | 为什么必须用 dummy？ | 经典 LeetCode 题目 |
| :--- | :--- | :--- | :--- |
| **1. 头节点可能会被【删除】** | 排在第 1 位的人可能会被开除 | 平时删人是让“前一个人越过他拉后一个人”。第 1 个人前面没人拉，用 dummy 就能直接伸手拉第 2 个人，把第 1 个人踢出队伍。 | • **LC 19 删除倒数第 N 个节点**<br>• **LC 203 移除链表元素**<br>• **LC 82 删除排序链表中的重复元素 II** |
| **2. 头节点可能会被【换到后面】** | 第 1 个人和别人换位置 / 前半段翻转 | 换完之后不知道谁来拉住新的第 1 个人。用 dummy 始终抓着最前端，换完后 dummy 改拉新上来的第 1 个人。 | • **LC 92 反转链表 II (left=1 时)**<br>• **LC 24 两两交换链表中的节点**<br>• **LC 25 K 个一组翻转链表** |
| **3. 从零开始【构建新队伍】** | 两个队伍合并 / 大数相加生成新链表 | 一开始根本不知道谁会成为新队伍的老大。先立一个 dummy 假人当锚点，后面谁小就往 dummy 后面挂。 | • **LC 21 合并两个有序链表**<br>• **LC 23 合并 K 个升序链表**<br>• **LC 2 两数相加**<br>• **LC 86 分隔链表** |

---

## 🚫 四、 什么时候【不需要】用 dummy？

如果一道题满足以下情况，就不需要 dummy：
1. **完全全量反转链表（LeetCode 206）**：
   * 原头节点自然变成尾节点（指向 `null`），新头节点由循环结束时的 `prev` 指针自然带出，直接用 `let prev = null;` 即可。
2. **只读 / 查找类操作**：
   * 比如只求链表长度、用快慢指针找中点、判断是否有环（LC 141）等，不改变链表头部的拓扑结构。

---

## 🔍 五、 经典对比：以「删除链表节点」为例

假设我们要删除链表中的某个节点：

### ❌ 不用 dummy（代码充满特判，极易漏边界）：
```javascript
function removeElements(head, val) {
    // 1. 如果要删的是头节点，必须单独用 while 循环不断把 head 往后挪
    while (head !== null && head.val === val) {
        head = head.next;
    }
    if (head === null) return null;

    // 2. 处理中间节点的删除
    let cur = head;
    while (cur.next !== null) {
        if (cur.next.val === val) {
            cur.next = cur.next.next;
        } else {
            cur = cur.next;
        }
    }
    return head;
}
```

### ✅ 使用 dummy（逻辑统一，优雅安全）：
```javascript
function removeElements(head, val) {
    // 1. 队伍最前面立个 dummy 假人
    const dummy = new ListNode(0, head);
    let cur = dummy;

    // 2. 统一处理所有节点的删除，无需特判头节点
    while (cur.next !== null) {
        if (cur.next.val === val) {
            cur.next = cur.next.next; // 越过目标节点
        } else {
            cur = cur.next;
        }
    }

    // 3. 直接返回 dummy 手里牵着的最新头节点！
    return dummy.next;
}
```

---

## 🌟 终极一秒判断法则

做题时只要问自己一句话：

> **“这道题做完后，原来的第 1 个节点（head）会不会变动/被删？或者需要新建链表？”**
> * **会变 / 可能会被删 / 可能会换人 / 是新建链表** $\to$ **第 1 行立即写 `const dummy = new ListNode(0, head);`**
> * **最后一行绝不纠结，直接写 `return dummy.next;`！**
