# 安装部署指南

## 环境要求

- Linux 服务器（CentOS/Ubuntu/Debian）
- Docker 已安装
- 服务器需开放应用端口（默认 5000）

---

## 安装前准备

### 1. 安装 Docker

如果未安装 Docker，安装脚本会自动提示安装。也可以手动安装：

```bash
# CentOS/Ubuntu/Debian 通用
curl -fsSL https://get.docker.com | bash

# 启动 Docker
systemctl start docker
systemctl enable docker
```

### 2. 开放端口

确保服务器防火墙和云安全组已放行应用端口（默认 5000）：

```bash
# ufw
ufw allow 5000/tcp

# firewalld
firewall-cmd --permanent --add-port=5000/tcp
firewall-cmd --reload
```

> 如果使用阿里云、腾讯云等云服务器，还需要在控制台的**安全组**中放行对应端口。

---

## 一键安装

运行以下命令：

```bash
curl -fsSL https://6qu.cc/dns2/install.sh | bash
```

脚本会自动检测 Docker 环境，中国服务器自动配置镜像加速。

---

## 安装方式

脚本提供三种安装方式，根据需求选择：

### 方式一：使用已有 MySQL 安装

适合已有 MySQL 数据库的用户，仅部署应用容器。

**前置条件：** 需要提前创建好数据库和用户：

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE liuqu_dns CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户并授权
CREATE USER 'liuqu_dns'@'%' IDENTIFIED BY '你的密码';
GRANT ALL PRIVILEGES ON liuqu_dns.* TO 'liuqu_dns'@'%';
FLUSH PRIVILEGES;
```

> ⚠️ 如果 MySQL 和应用在同一台服务器上，用户权限中的 `'%'` 可以改为 `'localhost'`。

**安装流程：** 选择 `1` 后按提示输入：
- 数据库地址（默认 127.0.0.1）
- 数据库端口（默认 3306）
- 数据库名称（默认 liuqu_dns）
- 数据库用户名（默认 liuqu_dns）
- 数据库密码（必填）
- 应用端口（默认 5000）

脚本会自动测试数据库连接，确认无误后开始安装。

> 💡 数据库在本机时，脚本会自动使用 host 网络模式，确保容器能正常连接本机 MySQL。

### 方式二：完整安装（应用 + MySQL）

自动部署应用和 MySQL 5.7 数据库，无需提前准备任何东西。

**安装流程：** 选择 `2` 后只需输入：
- 应用端口（默认 5000）
- MySQL 端口（默认 3306，仅本机访问）

数据库密码会自动随机生成，安装完成后会显示数据库连接信息，**请妥善保存**。

### 方式三：轻量安装（SQLite）

使用 SQLite 文件数据库，单容器部署，最简单。

**安装流程：** 选择 `3` 后只需输入：
- 应用端口（默认 5000）

数据库文件保存在 `/opt/dns/data/dns_system.db`。

---

## 菜单说明

```
========================================
    六趣DNS 管理脚本 v3.0
========================================
  GitHub: https://github.com/976853694/cloudflare-DNS
  QQ群:   1070970571

  首次安装请选择 1-3 中的一种方式：
  1 连接已有的MySQL数据库，仅部署应用容器
  2 自动部署应用和MySQL 5.7，无需提前准备数据库
  3 使用SQLite文件数据库，单容器部署，最简单

  1. 使用已有 MySQL 安装
  2. 完整安装（应用 + MySQL）
  3. 轻量安装（SQLite）
  ────────────────────────────────────────
  4. 更新
  5. 查看状态
  6. 查看日志
  7. 重启服务
  8. 备份数据
  9. 卸载
  0. 退出

========================================
```

| 功能 | 说明 |
|------|------|
| 更新 | 自动检测当前部署模式，拉取最新镜像并重启应用（数据库不受影响） |
| 查看状态 | 显示容器运行状态、部署模式、端口等信息 |
| 查看日志 | 查看应用日志或 MySQL 日志 |
| 重启服务 | 重启所有容器 |
| 备份数据 | 自动备份数据库、配置文件、插件和主题到 `/opt/dns/backups/` |
| 卸载 | 卸载前会提示备份，备份文件保存到 `/root/` |

---

## 访问系统

安装完成后访问：`http://服务器IP:端口`

**默认管理员账号：**
- 邮箱：`admin@qq.com`
- 密码：`admin123`

> ⚠️ **首次登录后请立即修改密码！**

---

## 目录结构

安装目录：`/opt/dns`

```
/opt/dns/
├── docker-compose.yml    # Docker 配置
├── .env                  # 环境变量配置
├── plugins/              # 插件目录
├── themes/               # 主题目录
├── logs/                 # 日志目录
├── backups/              # 备份目录
├── data/                 # SQLite 数据目录（方式三）
└── mysql-data/           # MySQL 数据目录（方式二）
```

**修改配置：**

```bash
cd /opt/dns
vim .env
docker compose restart
```

---

## 常见问题

### 1. 数据库连接失败

- 确保 MySQL 用户有正确的访问权限
- 如果 MySQL 在本机，确认 MySQL 服务已启动：`systemctl status mysql`
- 检查 MySQL 的 `bind-address` 配置

### 2. 端口无法访问

- 检查服务器防火墙是否放行了对应端口
- 云服务器需要在控制台安全组中放行端口
- 使用 `curl http://127.0.0.1:5000` 测试本地是否可访问

### 3. 容器启动失败

查看日志排查问题：

```bash
docker logs dns-app
```

### 4. 如何切换数据库类型

不支持在线切换。如需更换数据库类型，请先备份数据，卸载后重新选择安装方式。

---

## 技术支持

- GitHub：[https://github.com/976853694/cloudflare-DNS](https://github.com/976853694/cloudflare-DNS)
- QQ群：1070970571
