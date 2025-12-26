# 快速开始

欢迎使用 DNS 文档系统！本指南将帮助你快速上手。

## 简介

DNS（Domain Name System，域名系统）是互联网的核心基础设施之一，负责将人类可读的域名转换为计算机可识别的 IP 地址。

## 文档导航

### 🚀 入门指南

- [安装配置](/guide/installation) - 了解如何安装和配置 DNS 服务

### 📚 DNS 基础

- [DNS 概述](/basics/overview) - 了解 DNS 的基本概念
- [记录类型](/basics/record-types) - 学习各种 DNS 记录类型

### 📖 API 参考

- [API 文档](/api/) - 查看 API 接口说明

## 快速示例

查询域名的 A 记录：

```bash
nslookup example.com
```

或使用 dig 命令：

```bash
dig example.com A
```

## 下一步

建议按以下顺序阅读文档：

1. 阅读 [DNS 概述](/basics/overview) 了解基本概念
2. 学习 [记录类型](/basics/record-types) 掌握常用记录
3. 查看 [安装配置](/guide/installation) 开始实践
