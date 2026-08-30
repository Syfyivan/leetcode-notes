# HTTPS 握手过程（TLS 1.2 / TLS 1.3）

## 核心回答（面试口述版，1 分钟能讲完）

HTTPS = HTTP + TLS。先 TCP 三次握手，再做 TLS，之后 HTTP 报文用对称密钥加密。
TLS 1.2 要 2 个 RTT：Client Hello / Server Hello + 证书，再交换密钥，再双方 Finished。
TLS 1.3 压到 1 个 RTT：Client Hello 里直接带密钥分享参数，服务端选好就能算会话密钥。
会话票证 / PSK 复用可以 0 RTT，首包就带数据，有重放风险，只适合幂等请求。
非对称（RSA/ECDHE）只用来换钥匙，真正传数据是 AES 这种对称加密，快。
ECDHE 每次临时一对密钥，服务器长期私钥泄漏也解不开以前的流量，这叫前向安全。1.3 强制走这条路。

## 展开

### TLS 1.2（2 RTT）

1. **Client Hello**：支持的 TLS 版本、密码套件列表、客户端随机数 `random_c`、扩展（SNI、ALPN）
2. **Server Hello**：选定 TLS 版本 + 密码套件、服务器随机数 `random_s`
3. **Certificate**：服务器下发证书链（含公钥），客户端验签
4. **Server Key Exchange**（DHE/ECDHE 才有）：服务器发 DH 参数 + 签名
5. **Server Hello Done**
6. **Client Key Exchange**：客户端算出 `Pre-Master-Secret` 交给服务端
7. **两边各自**用 `random_c + random_s + pre_master` 导出主密钥 → 派生会话密钥
8. **Change Cipher Spec**：双方通知改用对称加密
9. **Finished**：双方用新密钥加密握手哈希互验，握手完成

RSA 密钥交换时，pre-master 用服务器证书公钥加密，没有临时 DH，没有前向安全。1.2 还能选这套，1.3 删了。

### TLS 1.3（1 RTT / 0 RTT）

1. 简化密码套件（仅 5 种，去掉 RSA/静态 DH，默认 PFS 前向安全）
2. Client Hello 一次性捎带密钥共享参数 → 1 RTT
3. 会话复用带上 PSK → 0 RTT

1.3 还把 Hello 之后的握手消息加密了，中间人更难看清证书以后的内容。ALPN 在 Hello 里协商 h2 / h3。

## 延伸

- 相关题：TCP 三次握手（先 TCP 再 TLS）、ALPN 协商 h2/h3、证书链。
- 对比题：证书只参与握手，业务数据走 AES。HTTPS 只防窃听和篡改，挡不住 XSS / CSRF。
- 面试加码：0-RTT 有重放风险，只给幂等请求。HSTS 强制跳 HTTPS。OCSP 装订知道就行。

## 常见追问

- Q: 用 RSA 做密钥交换为什么不能前向保密？ECDHE 为什么可以？
  A: RSA 交换：pre-master 用服务器**长期**公钥加密。谁拿到私钥和当时的抓包，就能算出会话密钥，解开历史流量。ECDHE：每次握手生成临时密钥对，算完就丢。长期证书私钥只用来签名，证明「我是这个服务器」，不解包。私钥泄漏只影响身份，不解开过去的 AES 密钥。

- Q: 证书链怎么验证的？根证书为什么可信？
  A: 站点证书（叶子）由中间 CA 签名，中间再由根 CA 签名。浏览器/OS 内置根证书信任锚。验证：检查签名、有效期、域名是否匹配（SAN）、有没有被 CRL/OCSP 吊销。根在信任库里，才把信任传下来。自签证书没有这条链，浏览器红字。

- Q: SNI 是什么？解决什么问题？
  A: Server Name Indication。Client Hello 里带上要访问的主机名。一台服务器、一个 IP 托管多个 HTTPS 站点时，必须先知道名字才能选出对应证书。没有 SNI 只能用默认证书，域名对不上就报警。现在几乎所有浏览器都发 SNI，注意它在 1.2 里是明文，会被运营商看到访问了哪个站；ECH（Encrypted Client Hello）在推进加密。

## 自己的易错点 / 之前答崩过的地方

我把「证书公钥加密整段 HTTP」当答案。证书只参与握手，业务数据是对称加密。
1.2 / 1.3 的 RTT 我背成一样。校招现在更爱问 1.3 为什么能 1 RTT。
HTTPS 我以为顺便防 CSRF / XSS。它只防窃听和篡改，身份伪造、脚本注入是另一层。
