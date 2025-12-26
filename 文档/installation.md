# 安装部署指南

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- 域名已托管在 Cloudflare

---

## 快速部署

### 方式一：内置数据库（推荐新手）

1. **创建项目目录**

```bash
mkdir dns && cd dns
```

2. **创建 docker-compose.yml**

```yaml
version: "3.8"

services:
  # MySQL 数据库
  db:
    image: mysql:8.0
    container_name: dns-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root123       # root 密码，请修改
      MYSQL_DATABASE: dns                # 数据库名
      MYSQL_USER: dns                    # 数据库用户
      MYSQL_PASSWORD: dns123             # 数据库密码，请修改
    volumes:
      - mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

  # DNS 应用
  app:
    image: 167729539/dns:latest
    container_name: dns-app
    restart: unless-stopped
    depends_on:
      - db
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: production
      SECRET_KEY: your-secret-key-change-me        # 请修改为随机字符串
      JWT_SECRET_KEY: your-jwt-secret-change-me    # 请修改为随机字符串
      DB_HOST: db
      DB_PORT: "3306"
      DB_NAME: dns
      DB_USER: dns
      DB_PASSWORD: dns123                          # 与上面保持一致

volumes:
  mysql_data:
```

3. **启动服务**

```bash
docker compose up -d
```

4. **查看日志**

```bash
docker compose logs -f app
```

---

### 方式二：外置数据库

适用于已有 MySQL 数据库的情况。

1. **创建 docker-compose.yml**

```yaml
version: "3.8"

services:
  app:
    image: 167729539/dns:latest
    container_name: dns-app
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: production
      SECRET_KEY: your-secret-key-change-me
      JWT_SECRET_KEY: your-jwt-secret-change-me
      DB_HOST: 192.168.1.100             # MySQL 服务器 IP
      DB_PORT: "3306"
      DB_NAME: dns
      DB_USER: dns
      DB_PASSWORD: your-password
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

> 如果 MySQL 在宿主机上，`DB_HOST` 使用 `host.docker.internal`

2. **启动服务**

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

## Nginx 反向代理（可选）

如需使用域名访问，配置 Nginx：

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

**启用 HTTPS**（推荐）：

```nginx
server {
    listen 443 ssl http2;
    server_name dns.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

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

## 环境变量说明

| 变量 | 必填 | 说明 | 默认值 |
|------|------|------|--------|
| `SECRET_KEY` | 是 | Flask 密钥，用于 session 加密 | dev-secret-key |
| `JWT_SECRET_KEY` | 是 | JWT 签名密钥 | jwt-secret-key |
| `DB_HOST` | 是 | 数据库地址 | localhost |
| `DB_PORT` | 否 | 数据库端口 | 3306 |
| `DB_NAME` | 是 | 数据库名称 | dns_system |
| `DB_USER` | 是 | 数据库用户名 | root |
| `DB_PASSWORD` | 是 | 数据库密码 | - |
| `FLASK_ENV` | 否 | 运行环境 | development |
| `JWT_ACCESS_TOKEN_EXPIRES` | 否 | Token 有效期(秒) | 86400 |

> 生产环境务必修改 `SECRET_KEY` 和 `JWT_SECRET_KEY` 为随机字符串！

**生成随机密钥**：

```bash
# Linux/Mac
openssl rand -hex 32

# 或使用 Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 数据持久化

### 数据库备份

```bash
# 备份数据库
docker exec dns-mysql mysqldump -u root -proot123 dns > backup.sql

# 恢复数据库
docker exec -i dns-mysql mysql -u root -proot123 dns < backup.sql
```

### 数据卷位置

```bash
# 查看数据卷
docker volume ls

# 查看数据卷详情
docker volume inspect dns_mysql_data
```

---

## 常见问题

### 1. 数据库连接失败

**错误**：`Can't connect to MySQL server`

**解决**：
- 检查 MySQL 容器是否启动：`docker ps`
- 检查数据库配置是否正确
- 等待 MySQL 完全启动（首次启动需要 30-60 秒）

### 2. 端口被占用

**错误**：`port is already allocated`

**解决**：
```bash
# 查看端口占用
netstat -tlnp | grep 5000

# 修改 docker-compose.yml 中的端口映射
ports:
  - "5001:5000"  # 改为其他端口
```

### 3. 权限问题

**错误**：`Permission denied`

**解决**：
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
