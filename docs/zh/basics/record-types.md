# DNS 记录类型

DNS 支持多种记录类型，每种类型有不同的用途。

## 常用记录类型

### A 记录

将域名指向 IPv4 地址。

```
example.com.    IN  A   192.168.1.1
www.example.com. IN  A   192.168.1.2
```

### AAAA 记录

将域名指向 IPv6 地址。

```
example.com.    IN  AAAA    2001:db8::1
```

### CNAME 记录

创建域名别名，指向另一个域名。

```
www.example.com.    IN  CNAME   example.com.
blog.example.com.   IN  CNAME   example.github.io.
```

> **注意**：CNAME 不能与其他记录共存于同一域名。

### MX 记录

指定邮件服务器，数字表示优先级（越小优先级越高）。

```
example.com.    IN  MX  10  mail1.example.com.
example.com.    IN  MX  20  mail2.example.com.
```

### TXT 记录

存储文本信息，常用于域名验证、SPF、DKIM 等。

```
example.com.    IN  TXT "v=spf1 include:_spf.google.com ~all"
```

### NS 记录

指定域名的权威 DNS 服务器。

```
example.com.    IN  NS  ns1.example.com.
example.com.    IN  NS  ns2.example.com.
```

## 其他记录类型

| 类型 | 用途 |
|------|------|
| SRV | 服务定位记录 |
| PTR | 反向解析记录 |
| CAA | 证书颁发机构授权 |
| SOA | 权威记录起始 |

## 记录查询

使用 dig 命令查询不同类型的记录：

```bash
# 查询 A 记录
dig example.com A

# 查询 MX 记录
dig example.com MX

# 查询所有记录
dig example.com ANY
```

## 最佳实践

1. **合理设置 TTL**：频繁变更的记录使用较短 TTL
2. **使用 CNAME 简化管理**：对于 CDN、云服务等场景
3. **配置备用 MX**：确保邮件服务高可用
4. **添加 SPF/DKIM**：防止邮件被标记为垃圾邮件
