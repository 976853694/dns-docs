# 安装配置

本文档介绍如何安装和配置 DNS 服务。

## 环境要求

- 操作系统：Linux / Windows / macOS
- 网络：确保 53 端口可用

## 常用 DNS 服务器

### BIND

BIND 是最广泛使用的 DNS 服务器软件。

```bash
# Ubuntu/Debian
sudo apt install bind9

# CentOS/RHEL
sudo yum install bind
```

### CoreDNS

CoreDNS 是一个灵活、可扩展的 DNS 服务器。

```bash
# 下载 CoreDNS
wget https://github.com/coredns/coredns/releases/download/v1.11.1/coredns_1.11.1_linux_amd64.tgz
tar -xzf coredns_1.11.1_linux_amd64.tgz
```

## 基本配置

### 配置文件示例

```conf
zone "example.com" {
    type master;
    file "/etc/bind/zones/example.com.zone";
};
```

### Zone 文件示例

```
$TTL 86400
@   IN  SOA ns1.example.com. admin.example.com. (
        2024010101  ; Serial
        3600        ; Refresh
        1800        ; Retry
        604800      ; Expire
        86400       ; Minimum TTL
)
    IN  NS  ns1.example.com.
    IN  A   192.168.1.1
www IN  A   192.168.1.2
```

## 验证配置

```bash
# 检查配置语法
named-checkconf

# 检查 zone 文件
named-checkzone example.com /etc/bind/zones/example.com.zone
```

## 常见问题

### 端口被占用

检查 53 端口是否被其他服务占用：

```bash
sudo lsof -i :53
```

### 解析失败

1. 检查防火墙设置
2. 确认 DNS 服务已启动
3. 验证配置文件语法
