# 用户端 API 接口文档

## 概述

- **Base URL**: `/api`
- **认证方式**: JWT Bearer Token
- **响应格式**: JSON

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误描述"
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token无效 |
| 402 | 余额不足 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

---

## 认证模块 `/api/auth`

### 获取图形验证码

**GET** `/api/auth/captcha`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 否 | 验证码ID，用于刷新 |

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "captcha_id": "abc123",
    "captcha_image": "data:image/png;base64,..."
  }
}
```

---

### 获取验证码配置

**GET** `/api/auth/captcha/config`

> 获取各场景验证码开关状态

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "login": true,
    "register": true,
    "forgot_password": true,
    "change_password": false,
    "change_email": false,
    "turnstile_enabled": true,
    "turnstile_site_key": "xxx"
  }
}
```

---

### 检查登录是否需要验证码

**GET** `/api/auth/login/captcha-status`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 用户邮箱 |

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "need_captcha": true
  }
}
```

---

### 检查注册状态

**GET** `/api/auth/register/status`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "register_enabled": true,
    "admin_email": "admin@example.com"
  }
}
```

---

### 发送注册验证邮件

**POST** `/api/auth/register/send`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| captcha_id | string | 否 | 验证码ID |
| captcha_code | string | 否 | 验证码 |
| turnstile_token | string | 否 | Turnstile Token |

---

### 完成注册

**POST** `/api/auth/register/complete`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 邮件中的验证token |
| username | string | 是 | 用户名(3-20字符) |
| password | string | 是 | 密码(6-32字符) |

---

### 用户登录

**POST** `/api/auth/login`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码 |
| captcha_id | string | 否 | 验证码ID |
| captcha_code | string | 否 | 验证码 |
| turnstile_token | string | 否 | Turnstile Token |
| totp_code | string | 否 | 2FA验证码（启用2FA时） |

#### 响应示例
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "balance": 100.00,
      "host_status": 0
    }
  }
}
```

---

### 获取当前用户信息

**GET** `/api/auth/me`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "balance": 100.00,
    "balance_text": "100.00",
    "max_domains": 10,
    "subdomain_count": 5,
    "host_status": 0,
    "is_host": false
  }
}
```

---

### 修改密码

**POST** `/api/auth/change-password`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| old_password | string | 是 | 旧密码 |
| new_password | string | 是 | 新密码 |
| captcha_id | string | 否 | 验证码ID |
| captcha_code | string | 否 | 验证码 |

---

### 发送找回密码邮件

**POST** `/api/auth/forgot-password/send`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| captcha_id | string | 否 | 验证码ID |
| captcha_code | string | 否 | 验证码 |

---

### 重置密码

**POST** `/api/auth/forgot-password/reset`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 邮件中的验证token |
| password | string | 是 | 新密码 |

---

### OAuth登录状态

**GET** `/api/auth/oauth/status`

> 获取各OAuth提供商的启用状态

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "github": true,
    "google": true,
    "nodeloc": false
  }
}
```

---

### 获取OAuth授权URL

**GET** `/api/auth/oauth/{provider}/url`

#### 路径参数
| 参数 | 说明 |
|------|------|
| provider | github / google / nodeloc |

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "url": "https://github.com/login/oauth/authorize?..."
  }
}
```

---

### OAuth登录回调

**POST** `/api/auth/oauth/{provider}/callback`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | OAuth授权码 |

---

### 绑定OAuth账号

**POST** `/api/auth/oauth/{provider}/bind`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | OAuth授权码 |

---

### 解绑OAuth账号

**POST** `/api/auth/oauth/{provider}/unbind`

---

## 域名模块 `/api`

### 获取可用主域名列表

**GET** `/api/domains`

> 无需认证

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "domains": [
      {
        "id": 1,
        "name": "example.com",
        "description": "示例域名",
        "is_host": false
      }
    ]
  }
}
```

---

### 检查域名前缀是否可用

**GET** `/api/domains/{domain_id}/check`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 域名前缀 |

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "available": true,
    "name": "test",
    "full_name": "test.example.com",
    "message": "可以注册"
  }
}
```

---

### 获取域名下的套餐

**GET** `/api/domains/{domain_id}/plans`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "基础套餐",
        "price": 10.00,
        "duration_days": 365,
        "duration_text": "365天",
        "min_length": 3,
        "max_length": 20,
        "max_records": 10,
        "description": "适合个人使用"
      }
    ]
  }
}
```

---

### 获取用户的二级域名列表

**GET** `/api/subdomains`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| per_page | int | 否 | 每页数量，默认20 |

---

### 获取二级域名详情

**GET** `/api/subdomains/{subdomain_id}`

---

### 购买域名

**POST** `/api/purchase`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_id | int | 是 | 套餐ID |
| name | string | 是 | 二级域名前缀 |
| coupon_code | string | 否 | 优惠码 |

#### 响应示例
```json
{
  "code": 201,
  "message": "购买成功",
  "data": {
    "subdomain": {
      "id": 1,
      "name": "test",
      "full_name": "test.example.com",
      "expires_at": "2027-01-04T00:00:00"
    },
    "cost": 10.00,
    "discount": 0,
    "balance": 90.00
  }
}
```

---

### 续费域名

**POST** `/api/subdomains/{subdomain_id}/renew`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_id | int | 是 | 续费套餐ID |

---

### 修改NS服务器

**PUT** `/api/subdomains/{subdomain_id}/ns`

> 修改二级域名的NS服务器，同时删除所有DNS记录

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ns_servers | array | 是 | NS服务器列表(1-10个) |

---

### 删除域名

**DELETE** `/api/subdomains/{subdomain_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| totp_code | string | 否 | 2FA验证码（启用2FA时） |

---

## DNS记录模块 `/api`

### 获取DNS记录

**GET** `/api/subdomains/{subdomain_id}/records`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "records": [
      {
        "id": "abc123",
        "type": "A",
        "name": "@",
        "content": "1.2.3.4",
        "ttl": 300,
        "proxied": false
      }
    ]
  }
}
```

---

### 添加DNS记录

**POST** `/api/subdomains/{subdomain_id}/records`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 记录类型(A/AAAA/CNAME/TXT/MX/NS/SRV/CAA) |
| name | string | 否 | 名称前缀，默认@ |
| content | string | 是 | 记录值 |
| ttl | int | 否 | TTL，默认300 |
| proxied | bool | 否 | 是否开启代理（Cloudflare），默认false |
| priority | int | 否 | 优先级(MX记录) |

---

### 更新DNS记录

**PUT** `/api/records/{record_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 否 | 记录值 |
| ttl | int | 否 | TTL |
| proxied | bool | 否 | 是否开启代理 |

---

### 删除DNS记录

**DELETE** `/api/records/{record_id}`

---

### DNS记录类型说明

| 类型 | 说明 | content示例 |
|------|------|-------------|
| A | IPv4地址 | 1.2.3.4 |
| AAAA | IPv6地址 | 2001:db8::1 |
| CNAME | 别名记录 | example.com |
| TXT | 文本记录 | v=spf1 include:example.com |
| MX | 邮件记录 | mail.example.com |
| NS | NS记录 | ns1.example.com |
| SRV | 服务记录 | 10 5 5060 sip.example.com |
| CAA | CA授权记录 | 0 issue "letsencrypt.org" |

---

## 卡密模块 `/api`

### 验证卡密

**POST** `/api/redeem/verify`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 卡密码 |

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "valid": true,
    "amount": 100.00,
    "amount_text": "100.00"
  }
}
```

---

### 使用卡密充值

**POST** `/api/redeem`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 卡密码 |

#### 响应示例
```json
{
  "code": 200,
  "message": "充值成功",
  "data": {
    "amount": 100.00,
    "balance": 200.00
  }
}
```

---

## 安全设置模块 `/api/security`

### 获取2FA状态

**GET** `/api/security/2fa/status`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "enabled": true,
    "backup_codes_remaining": 8
  }
}
```

---

### 初始化2FA设置

**POST** `/api/security/2fa/setup`

> 生成密钥和二维码

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "uri": "otpauth://totp/...",
    "qr_code": "data:image/png;base64,..."
  }
}
```

---

### 启用2FA

**POST** `/api/security/2fa/enable`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 6位验证码 |

#### 响应示例
```json
{
  "code": 200,
  "message": "双因素认证已启用",
  "data": {
    "backup_codes": ["12345678", "23456789", ...]
  }
}
```

---

### 禁用2FA

**POST** `/api/security/2fa/disable`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| password | string | 是 | 账户密码 |
| code | string | 是 | 2FA验证码 |

---

### 重新生成备用码

**POST** `/api/security/2fa/backup-codes`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 2FA验证码 |

---

### 获取IP限制设置

**GET** `/api/security/ip-restriction`

---

### 更新IP限制设置

**PUT** `/api/security/ip-restriction`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| allowed_ips | array | 是 | 允许的IP列表 |

---

### 获取登录历史

**GET** `/api/security/sessions`

---

### 获取API密钥信息

**GET** `/api/security/api-keys`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "api_key": "ak_xxx",
    "api_secret": "******",
    "api_enabled": true,
    "api_ip_whitelist": ["1.2.3.4"]
  }
}
```

---

### 生成API密钥

**POST** `/api/security/api-keys/generate`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| password | string | 否 | 账户密码（已有密钥时需要） |

#### 响应示例
```json
{
  "code": 200,
  "message": "API密钥已生成",
  "data": {
    "api_key": "ak_xxx",
    "api_secret": "sk_xxx"
  }
}
```

---

### 启用/禁用API

**POST** `/api/security/api-keys/toggle`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| enabled | bool | 是 | 是否启用 |

---

### 更新API IP白名单

**PUT** `/api/security/api-keys/whitelist`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ip_whitelist | array | 是 | IP白名单列表 |

---

### 查看API Secret

**POST** `/api/security/api-keys/secret`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| password | string | 是 | 账户密码 |

---

## 公告模块 `/api`

### 获取公告列表

**GET** `/api/announcements`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |

---

### 获取公告详情

**GET** `/api/announcements/{id}`

---

### 标记公告已读

**POST** `/api/announcements/{id}/read`

---

### 获取未读公告数

**GET** `/api/announcements/unread-count`


---

## 虚拟主机模块 `/api/vhost`

### 获取可购买套餐列表

**GET** `/api/vhost/plans`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "基础套餐",
        "price": 50.00,
        "duration_days": 30,
        "disk_space": 1024,
        "bandwidth": 10240,
        "max_domains": 5,
        "max_databases": 1,
        "description": "适合个人网站"
      }
    ]
  }
}
```

---

### 购买虚拟主机

**POST** `/api/vhost/purchase`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_id | int | 是 | 套餐ID |
| domain | string | 是 | 主域名 |
| coupon_code | string | 否 | 优惠码 |

#### 响应示例
```json
{
  "code": 201,
  "message": "购买成功",
  "data": {
    "instance": {
      "id": 1,
      "domain": "example.com",
      "status": 1,
      "expires_at": "2026-02-04T00:00:00"
    }
  }
}
```

---

### 获取我的主机列表

**GET** `/api/vhost/instances`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | int | 否 | 状态筛选 |

---

### 获取主机详情

**GET** `/api/vhost/instances/{instance_id}`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "instance": {
      "id": 1,
      "domain": "example.com",
      "status": 1,
      "expires_at": "2026-02-04T00:00:00",
      "plan_name": "基础套餐",
      "disk_space": 1024,
      "bandwidth": 10240,
      "ftp_host": "ftp.server.com",
      "ftp_port": 21,
      "ftp_user": "user_xxx",
      "ftp_password": "xxx",
      "db_host": "localhost",
      "db_name": "db_xxx",
      "db_user": "user_xxx",
      "db_password": "xxx"
    }
  }
}
```

---

### 续费主机

**POST** `/api/vhost/instances/{instance_id}/renew`

---

### 获取我的订单

**GET** `/api/vhost/orders`

---

### 获取绑定的域名列表

**GET** `/api/vhost/instances/{instance_id}/domains`

---

### 添加域名绑定

**POST** `/api/vhost/instances/{instance_id}/domains`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain | string | 是 | 域名 |

---

### 删除域名绑定

**DELETE** `/api/vhost/instances/{instance_id}/domains/{domain_id}`

---

### 获取文件列表

**GET** `/api/vhost/instances/{instance_id}/files`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 否 | 目录路径，默认/ |

---

### 读取文件内容

**GET** `/api/vhost/instances/{instance_id}/files/read`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 文件路径 |

---

### 保存文件内容

**POST** `/api/vhost/instances/{instance_id}/files/save`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 文件路径 |
| content | string | 是 | 文件内容 |

---

### 创建文件

**POST** `/api/vhost/instances/{instance_id}/files/create`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 文件路径 |

---

### 创建目录

**POST** `/api/vhost/instances/{instance_id}/files/mkdir`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 目录路径 |

---

### 删除文件或目录

**POST** `/api/vhost/instances/{instance_id}/files/delete`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 路径 |
| is_dir | bool | 否 | 是否为目录 |

---

### 重命名文件

**POST** `/api/vhost/instances/{instance_id}/files/rename`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| path | string | 是 | 原路径 |
| new_name | string | 是 | 新名称 |

---

### 复制文件

**POST** `/api/vhost/instances/{instance_id}/files/copy`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| source | string | 是 | 源路径 |
| dest | string | 是 | 目标路径 |

---

### 移动文件

**POST** `/api/vhost/instances/{instance_id}/files/move`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| source | string | 是 | 源路径 |
| dest | string | 是 | 目标路径 |

---

### 压缩文件

**POST** `/api/vhost/instances/{instance_id}/files/zip`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| source | string | 是 | 源路径 |
| zip_name | string | 是 | 压缩包名称 |

---

### 解压文件

**POST** `/api/vhost/instances/{instance_id}/files/unzip`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| zip_path | string | 是 | 压缩包路径 |
| dest_path | string | 否 | 解压目标路径 |

---

### 获取PHP版本列表

**GET** `/api/vhost/instances/{instance_id}/php-versions`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "versions": ["74", "80", "81", "82"],
    "current_version": "80"
  }
}
```

---

### 设置PHP版本

**POST** `/api/vhost/instances/{instance_id}/php-version`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| version | string | 是 | PHP版本号 |

---

### 获取运行目录

**GET** `/api/vhost/instances/{instance_id}/run-path`

---

### 设置运行目录

**POST** `/api/vhost/instances/{instance_id}/run-path`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| run_path | string | 是 | 运行目录路径 |

---

### 获取伪静态规则

**GET** `/api/vhost/instances/{instance_id}/rewrite`

---

### 设置伪静态规则

**POST** `/api/vhost/instances/{instance_id}/rewrite`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 伪静态规则内容 |

---

### 获取伪静态模板

**GET** `/api/vhost/instances/{instance_id}/rewrite/template/{name}`

---

### 获取SSL状态

**GET** `/api/vhost/instances/{instance_id}/ssl`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "status": true,
    "https_force": true,
    "cert_info": {
      "issuer": "Let's Encrypt",
      "notAfter": "2026-04-04",
      "notBefore": "2026-01-04",
      "dns": ["example.com", "www.example.com"]
    }
  }
}
```

---

### 部署SSL证书

**POST** `/api/vhost/instances/{instance_id}/ssl`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | string | 是 | 证书私钥 |
| csr | string | 是 | 证书内容 |

---

### 关闭SSL

**DELETE** `/api/vhost/instances/{instance_id}/ssl`

---

### 设置强制HTTPS

**POST** `/api/vhost/instances/{instance_id}/ssl/force-https`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| enable | bool | 是 | 是否启用 |
