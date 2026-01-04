# 安装部署指南

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 1GB 内存
- 域名已托管在支持的DNS服务商

---

## 快速部署

### 方式一：内置数据库（推荐）

适用于新手或单机部署，MySQL和Redis都在Docker容器中运行。

**1. 创建项目目录**

```bash
mkdir dns && cd dns
```

**2. 创建 docker-compose.yml**

```yaml
version: "3.8"

services:
  # MySQL 数据库
  db:
    image: mysql:8.0
    container_name: dns-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root123       # root 密码
      MYSQL_DATABASE: dns                # 自动创建数据库
      MYSQL_USER: dns                    # 创建用户
      MYSQL_PASSWORD: dns                # 用户密码
    volumes:
      - mysql_data:/var/lib/mysql        # 数据持久化
    command: --default-authentication-plugin=mysql_native_password

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: dns-redis
    restart: unless-stopped
    command: redis-server --maxmemory 64mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data                 # 数据持久化

  # DNS 应用
  app:
    image: 167729539/dns:latest
    container_name: dns-app
    restart: unless-stopped
    depends_on:
      - db
      - redis
    ports:
      - "5000:5000"
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    environment:
      FLASK_ENV: production
      SECRET_KEY: change-me-in-production
      JWT_SECRET_KEY: change-me-in-production
      DB_HOST: db
      DB_PORT: "3306"
      DB_NAME: dns
      DB_USER: dns
      DB_PASSWORD: dns
      REDIS_URL: redis://redis:6379/0

volumes:
  mysql_data:
  redis_data:
```

**3. 启动服务**

```bash
docker compose up -d
```

**4. 查看日志**

```bash
docker compose logs -f app
```

---

### 方式二：外置数据库

适用于已有MySQL数据库的情况，或需要数据库高可用的场景。

**1. 创建 docker-compose.yml**

```yaml
version: "3.8"

services:
  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: dns-redis
    restart: unless-stopped
    command: redis-server --maxmemory 64mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data

  # DNS 应用
  app:
    image: 167729539/dns:latest
    container_name: dns-app
    restart: unless-stopped
    depends_on:
      - redis
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: production
      SECRET_KEY: your-secret-key-change-me
      JWT_SECRET_KEY: your-jwt-secret-change-me
      DB_HOST: host.docker.internal      # 宿主机数据库
      DB_PORT: "3306"
      DB_NAME: dns
      DB_USER: dns
      DB_PASSWORD: your-password
      REDIS_URL: redis://redis:6379/0
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  redis_data:
```

**2. 准备数据库**

在MySQL中创建数据库和用户：

```sql
CREATE DATABASE dns CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dns'@'%' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON dns.* TO 'dns'@'%';
FLUSH PRIVILEGES;
```

**3. 启动服务**

```bash
docker compose up -d
```

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

## 环境变量说明

| 变量 | 必填 | 说明 | 默认值 |
|------|------|------|--------|
| `SECRET_KEY` | 是 | Flask密钥，用于session加密 | dev-secret-key |
| `JWT_SECRET_KEY` | 是 | JWT签名密钥 | jwt-secret-key |
| `JWT_ACCESS_TOKEN_EXPIRES` | 否 | Token有效期(秒) | 86400 |
| `DB_HOST` | 是 | 数据库地址 | localhost |
| `DB_PORT` | 否 | 数据库端口 | 3306 |
| `DB_NAME` | 是 | 数据库名称 | dns_system |
| `DB_USER` | 是 | 数据库用户名 | root |
| `DB_PASSWORD` | 是 | 数据库密码 | - |
| `REDIS_URL` | 否 | Redis连接地址 | - |
| `FLASK_ENV` | 否 | 运行环境 | development |

> 生产环境务必修改 `SECRET_KEY` 和 `JWT_SECRET_KEY` 为随机字符串！

**生成随机密钥**：

```bash
# Linux/Mac
openssl rand -hex 32

# 或使用 Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## Nginx 反向代理

### HTTP 配置

```nginx
server {
    listen 80;
    server_name dns.example.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### HTTPS 配置（推荐）

```nginx
server {
    listen 443 ssl http2;
    server_name dns.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name dns.example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 版本更新

```bash
# 拉取最新镜像并重启
docker compose pull && docker compose down && docker compose up -d
```

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

### 查看数据卷

```bash
# 查看数据卷列表
docker volume ls

# 查看数据卷详情
docker volume inspect dns_mysql_data
```

---

## 常见问题

### 1. 数据库连接失败

**错误**：`Can't connect to MySQL server`

**解决方案**：
- 检查MySQL容器是否启动：`docker ps`
- 等待MySQL完全启动（首次启动需要30-60秒）
- 检查数据库配置是否正确
- 查看MySQL日志：`docker logs dns-mysql`

### 2. 端口被占用

**错误**：`port is already allocated`

**解决方案**：
```bash
# 查看端口占用
netstat -tlnp | grep 5000

# 修改 docker-compose.yml 中的端口映射
ports:
  - "5001:5000"  # 改为其他端口
```

### 3. 权限问题

**错误**：`Permission denied`

**解决方案**：
```bash
# 确保当前用户在 docker 组
sudo usermod -aG docker $USER

# 重新登录或执行
newgrp docker
```

### 4. 容器无法启动

```bash
# 查看容器日志
docker logs dns-app

# 查看详细错误
docker compose logs -f
```

### 5. 验证码总是错误

多进程环境下需配置Redis，确保 `REDIS_URL` 环境变量已设置。

### 6. 邮件发送失败

1. 检查SMTP配置是否正确
2. 部分邮箱需开启SMTP服务并使用授权码
3. 检查端口：SSL用465，STARTTLS用587

### 7. 2FA二维码无法生成

确保容器中已安装qrcode库，正常情况下镜像已包含。
