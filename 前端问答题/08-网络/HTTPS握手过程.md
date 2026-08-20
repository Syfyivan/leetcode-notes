# HTTPS 握手过程（TLS 1.2 / TLS 1.3）

## 核心回答（面试口述版，1 分钟能讲完）

TODO

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

### TLS 1.3（1 RTT / 0 RTT）

1. 简化密码套件（仅 5 种，去掉 RSA/静态 DH，默认 PFS 前向安全）
2. Client Hello 一次性捎带密钥共享参数 → 1 RTT
3. 会话复用带上 PSK → 0 RTT

## 常见追问

- Q: 用 RSA 做密钥交换为什么不能前向保密？ECDHE 为什么可以？
  A:
- Q: 证书链怎么验证的？根证书为什么可信？
  A:
- Q: SNI 是什么？解决什么问题？
  A:

## 自己的易错点 / 之前答崩过的地方

TODO
</content>
