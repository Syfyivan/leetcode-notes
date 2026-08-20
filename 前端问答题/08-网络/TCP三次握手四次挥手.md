# TCP 三次握手与四次挥手

## 核心回答（面试口述版，1 分钟能讲完）

TODO

## 展开

### 三次握手（建立连接）

1. **SYN**（Client→Server）：seq=x，状态 CLOSED → SYN_SENT
2. **SYN+ACK**（Server→Client）：seq=y，ack=x+1，状态 LISTEN → SYN_RCVD
3. **ACK**（Client→Server）：ack=y+1，状态 ESTABLISHED；服务端收到后也 ESTABLISHED

**为什么不是两次？** 防止已失效的连接请求突然到服务端，导致服务端误以为是新连接并一直等待，浪费资源。

### 四次挥手（关闭连接，全双工所以两边各关一次）

1. **FIN**（Client→Server）：Client 没数据了，ESTABLISHED → FIN_WAIT_1
2. **ACK**（Server→Client）：服务端应答；状态 CLOSE_WAIT；Client 收到后 FIN_WAIT_2
3. **FIN**（Server→Client）：服务端也发完了；状态 LAST_ACK
4. **ACK**（Client→Server）：Client 应答；Client 状态 TIME_WAIT；服务端收到后 CLOSED

**为什么要 TIME_WAIT 等 2MSL？**
- 保证最后一个 ACK 能到达对端（丢了 Server 会重发 FIN，Client 还能收到）
- 让本次连接的所有旧报文在网络中自然消失，防止污染下一个同四元组的新连接

## 常见追问

- Q: SYN Flood 攻击是什么？怎么防？（SYN Cookies / 缩短 SYN Timeout / 增加 backlog）
  A:
- Q: 为什么建立是三次，关闭要四次？（服务端可能还有数据没发完，FIN 和 ACK 不能合并）
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
