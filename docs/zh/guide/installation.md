# 安装部署指南

## 环境要求

- Linux 系统（Ubuntu/Debian/CentOS 等）
- 至少 1GB 内存
- 域名已托管在支持的DNS服务商

---

## 一键安装

### 方式一：内置数据库（推荐）

适用于新手或单机部署，MySQL 和 Redis 都在 Docker 容器中运行。

```bash
curl -fsSL https://6qu.cc/dns/install.sh | bash
```

安装完成后，脚本会自动配置并启动服务。

---

### 方式二：外置数据库

适用于已有 MySQL 数据库的情况，或需要数据库高可用的场景。

```bash
curl -fsSL https://6qu.cc/dns2/install.sh | bash
```

> ⚠️ **注意**：使用外置数据库版本前，请确保：
> - 已有可用的 MySQL 数据库（5.6+ ）
> - 数据库允许远程连接
> - 已创建数据库和用户，并授予相应权限

**准备数据库**：

安装脚本会提示输入数据库连接信息。

---

## 访问系统

启动成功后访问：

| 页面 | 地址 |
|------|------|
| 用户前台 | http://服务器IP:5000 |
| 管理后台 | http://服务器IP:5000/admin |

**默认管理员账号**：
- 邮箱：`admin@qq.com`
- 密码：`admin123`

> ⚠️ **首次登录后请立即修改密码！**

---

## 管理脚本

安装完成后，可以在终端输入 `dns` 命令唤醒管理菜单：

```bash
dns
```

菜单选项：

| 选项 | 功能 |
|------|------|
| 1 | 启动服务 |
| 2 | 停止服务 |
| 3 | 重启服务 |
| 4 | 查看状态 |
| 5 | 查看日志 |
| 6 | 更新程序 |
| 7 | 卸载程序 |
| 0 | 退出 |

---

## 数据备份与恢复

### 备份数据库

```bash
# 备份到文件
docker exec dns-mysql mysqldump -u root -proot123 dns > backup_$(date +%Y%m%d).sql
```

### 恢复数据库

```bash
# 从文件恢复
docker exec -i dns-mysql mysql -u root -proot123 dns < backup.sql
```

---

## 常见问题

### 1. 安装脚本执行失败

**解决方案**：
- 确保系统已安装 curl：`apt install curl` 或 `yum install curl`
- 检查网络连接是否正常
- 尝试使用 root 用户执行

### 2. 端口被占用

**错误**：`port is already allocated`

**解决方案**：
```bash
# 查看端口占用
netstat -tlnp | grep 5000

# 停止占用端口的服务后重新安装
```

### 3. 权限问题

**错误**：`Permission denied`

**解决方案**：
```bash
# 使用 root 用户执行安装脚本
sudo curl -fsSL https://6qu.cc/dns/install.sh | bash
```

### 4. 验证码总是错误

多进程环境下需配置Redis，确保 Redis 服务正常运行。

### 5. 邮件发送失败

1. 检查SMTP配置是否正确
2. 部分邮箱需开启SMTP服务并使用授权码
3. 检查端口：SSL用465，STARTTLS用587
