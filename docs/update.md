# 更新升级指南

## 快速更新

一键更新命令：

```bash
docker compose pull && docker compose down && docker compose up -d
```

---

## 详细更新步骤

### 1. 备份数据（重要）

更新前务必备份数据库：

```bash
# 备份数据库
docker exec dns-mysql mysqldump -u root -p<密码> dns > backup_$(date +%Y%m%d).sql

# 备份 docker-compose.yml
cp docker-compose.yml docker-compose.yml.bak
```

### 2. 拉取最新镜像

```bash
docker compose pull
```

或指定版本：

```bash
docker pull 167729539/dns:v2.7
```

### 3. 停止当前服务

```bash
docker compose down
```

### 4. 启动新版本

```bash
docker compose up -d
```

### 5. 验证更新

```bash
# 查看容器状态
docker ps

# 查看应用日志
docker compose logs -f app

# 检查版本（登录后台查看）
```

---

## 版本回滚

如果新版本有问题，可以回滚到旧版本：

### 方法一：指定版本号

```bash
# 修改 docker-compose.yml 中的镜像版本
image: 167729539/dns:v2.6  # 改为旧版本号

# 重新部署
docker compose down
docker compose up -d
```

### 方法二：恢复备份

```bash
# 停止服务
docker compose down

# 恢复数据库
docker exec -i dns-mysql mysql -u root -p<密码> dns < backup_20241225.sql

# 启动服务
docker compose up -d
```

---

## 数据库迁移

系统支持自动数据库迁移，更新时会自动：

- 添加新字段
- 创建新表
- 迁移数据

**迁移日志**：

```bash
docker compose logs app | grep Migration
```

如果看到类似输出，说明迁移成功：

```
[OK] Migrations applied: subdomains.ns_mode, users.totp_enabled, ...
```

---

## 常见更新问题

### 1. 镜像拉取失败

**错误**：`Error response from daemon: pull access denied`

**解决**：
```bash
# 检查网络
ping hub.docker.com

# 使用国内镜像源
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}

# 重启 Docker
sudo systemctl restart docker
```

### 2. 数据库迁移失败

**错误**：`Migration failed: ...`

**解决**：
```bash
# 查看详细错误
docker compose logs app

# 手动执行迁移（进入容器）
docker exec -it dns-app bash
python -c "from app import create_app; create_app()"
```

### 3. 容器启动失败

**错误**：`Container exited with code 1`

**解决**：
```bash
# 查看错误日志
docker logs dns-app

# 常见原因：
# 1. 数据库连接失败 - 检查 DB_* 环境变量
# 2. 端口冲突 - 检查 5000 端口
# 3. 配置错误 - 检查环境变量格式
```

### 4. 更新后页面异常

**解决**：
```bash
# 清除浏览器缓存
# 或强制刷新：Ctrl + Shift + R

# 如果是静态资源问题，重启容器
docker compose restart app
```

---

## 版本历史

### v2.7 (当前版本)
- 套餐支持多域名关联
- 优化管理后台界面
- 修复已知问题

### v2.6
- 新增优惠券功能
- 新增 IP 黑名单
- 优化定时任务

### v2.5
- 新增 NS 托管切换
- 新增自动续费
- 新增 2FA 双因素认证

### v2.4
- 新增邮箱验证
- 新增公告系统
- 优化购买流程

---

## 检查更新

### 方法一：查看 Docker Hub

访问 [Docker Hub](https://hub.docker.com/r/167729539/dns/tags) 查看最新版本。

### 方法二：系统内检查

登录管理后台，系统会自动检查更新并提示。

### 方法三：命令行检查

```bash
# 查看当前版本
docker inspect dns-app | grep -i version

# 查看远程最新版本
docker pull 167729539/dns:latest --dry-run
```

---

## 自动更新（可选）

使用 Watchtower 实现自动更新：

```yaml
# 在 docker-compose.yml 中添加
services:
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 86400 dns-app  # 每天检查一次
```

> ⚠️ 生产环境建议手动更新，避免自动更新导致问题。

---

## 更新最佳实践

1. **先在测试环境验证** - 有条件的话先在测试环境更新
2. **备份数据** - 更新前务必备份数据库
3. **查看更新日志** - 了解新版本的变更内容
4. **选择低峰期** - 在用户访问较少时更新
5. **保留回滚方案** - 记录旧版本号，准备回滚脚本
