# TCP 三次握手与四次挥手

## 核心回答（面试口述版，1 分钟能讲完）

TCP 要先握手再传数据，双方都确认对方的发送序号可用。
第一次：客户端 SYN，seq=x。第二次：服务端 SYN+ACK，seq=y，ack=x+1。第三次：客户端 ACK，ack=y+1。两边进入 ESTABLISHED。
两次不够：作废的 SYN 迟到会让服务端空等一个不存在的连接。
挥手四次，因为 TCP 全双工，两边各关一条方向。先 FIN，对端先 ACK 表示「我知道你没数据了」，自己可能还有数据要发，发完再 FIN，最后再 ACK。
主动关闭的那方进入 TIME_WAIT，等 2MSL。保证最后的 ACK 能到，也让旧包在网上消失。
面试能把状态名字说全：SYN_SENT、SYN_RCVD、ESTABLISHED、FIN_WAIT_1/2、CLOSE_WAIT、LAST_ACK、TIME_WAIT。

## 展开

### 三次握手（建立连接）

1. **SYN**（Client→Server）：seq=x，状态 CLOSED → SYN_SENT
2. **SYN+ACK**（Server→Client）：seq=y，ack=x+1，状态 LISTEN → SYN_RCVD
3. **ACK**（Client→Server）：ack=y+1，状态 ESTABLISHED；服务端收到后也 ESTABLISHED

**为什么不是两次？** 防止已失效的连接请求突然到服务端，导致服务端误以为是新连接并一直等待，浪费资源。

第三次握手也可以带数据（TFO），一般面试按不带数据讲。ISN（初始序号）要随机，防预测。

### 四次挥手（关闭连接，全双工所以两边各关一次）

1. **FIN**（Client→Server）：Client 没数据了，ESTABLISHED → FIN_WAIT_1
2. **ACK**（Server→Client）：服务端应答；状态 CLOSE_WAIT；Client 收到后 FIN_WAIT_2
3. **FIN**（Server→Client）：服务端也发完了；状态 LAST_ACK
4. **ACK**（Client→Server）：Client 应答；Client 状态 TIME_WAIT；服务端收到后 CLOSED

**为什么要 TIME_WAIT 等 2MSL？**
- 保证最后一个 ACK 能到达对端（丢了 Server 会重发 FIN，Client 还能收到）
- 让本次连接的所有旧报文在网络中自然消失，防止污染下一个同四元组的新连接

服务端如果立刻把第二、第三次合并成 FIN+ACK，就变成三次挥手。那要求服务端没有剩余数据，不能当常规。

## 延伸

- 相关题：HTTP/2 仍受 TCP 丢包影响、TLS 叠在握手之后、连接耗时。
- 对比题：TIME_WAIT 在先发 FIN 的那侧，高并发短连接客户端或反向代理会爆。CLOSE_WAIT 一堆是本端没调 close。
- 面试加码：ISN 要随机。第三次握手可以带数据（TFO）。状态名字能说全 SYN_SENT / SYN_RCVD / FIN_WAIT / CLOSE_WAIT。

## 常见追问

- Q: SYN Flood 攻击是什么？怎么防？（SYN Cookies / 缩短 SYN Timeout / 增加 backlog）
  A: 攻击者狂发 SYN，不回第三次 ACK。服务端堆大量 SYN_RCVD，backlog 满了正常用户进不来。防护：SYN Cookie（不分配 TCB，把状态编码进 seq，第三次来了再重建）、加大 backlog、缩短 syn timeout、防火墙限速、Annycast / 清洗。

- Q: 为什么建立是三次，关闭要四次？（服务端可能还有数据没发完，FIN 和 ACK 不能合并）
  A: 握手时服务端「我可以收也可以发」一次 SYN+ACK 就能表达。关闭时，对端 ACK 你的 FIN 只表示「你那边发完了」，他自己可能还要发完缓冲区。FIN 和这个 ACK 拆开，所以四次。他没数据了也可以合并，那是优化，不是默认。

## 自己的易错点 / 之前答崩过的地方

TIME_WAIT 我以为是服务端。其实在**先说 FIN 的那一侧**，高并发短连接的客户端或反向代理会爆 TIME_WAIT。
CLOSE_WAIT 一堆，我当成握手问题。那是**本端没调 close**，应用没读完或没关 socket，对端已经 FIN 了。
seq 和 ack 的 +1 我背反。ACK 的值是对端 seq+1，表示「我下一个期望这个号」。
