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

---

## 认证模块 `/api/auth`

### 获取图形验证码

**GET** `/api/auth/captcha`

> 登录连续失败3次后需要验证码

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

### 检查登录是否需要验证码

**GET** `/api/auth/login/captcha-status`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 用户邮箱 |


---

### 发送注册验证邮件

**POST** `/api/auth/register/send`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |

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
| captcha_id | string | 否 | 验证码ID（需要验证码时） |
| captcha_code | string | 否 | 验证码（需要验证码时） |
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
      "balance": 100.00
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

---

## 域名模块 `/api`

### 获取可用主域名列表

**GET** `/api/domains`

> 无需认证

---

### 检查域名前缀是否可用

**GET** `/api/domains/{domain_id}/check`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 域名前缀 |

---

### 获取域名下的套餐

**GET** `/api/domains/{domain_id}/plans`

---

### 获取用户的二级域名列表

**GET** `/api/subdomains`

#### 请求头
```
Authorization: Bearer <access_token>
```

---

### 购买域名

**POST** `/api/purchase`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_id | int | 是 | 套餐ID |
| name | string | 是 | 二级域名前缀 |
| coupon_code | string | 否 | 优惠码 |


---

### 续费域名

**POST** `/api/subdomains/{subdomain_id}/renew`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_id | int | 是 | 续费套餐ID |

---

### 修改NS服务器

**PUT** `/api/subdomains/{subdomain_id}/ns`

> 修改二级域名的NS服务器，同时删除所有DNS记录

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ns_servers | array | 是 | NS服务器列表(1-10个) |

---

## 卡密模块 `/api`

### 验证卡密

**POST** `/api/redeem/verify`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 卡密码 |

---

### 使用卡密充值

**POST** `/api/redeem`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 卡密码 |

---

## DNS记录模块 `/api`

### 获取DNS记录

**GET** `/api/subdomains/{subdomain_id}/records`

#### 请求头
```
Authorization: Bearer <access_token>
```

---

### 添加DNS记录

**POST** `/api/subdomains/{subdomain_id}/records`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 记录类型(A/AAAA/CNAME/TXT/MX) |
| name | string | 否 | 名称前缀，默认@ |
| content | string | 是 | 记录值 |
| ttl | int | 否 | TTL，默认300 |
| proxied | bool | 否 | 是否开启代理，默认false |
| priority | int | 否 | 优先级(MX记录) |

---

### 更新DNS记录

**PUT** `/api/records/{record_id}`

---

### 删除DNS记录

**DELETE** `/api/records/{record_id}`

---

## 安全设置模块 `/api/security`

### 初始化2FA设置

**POST** `/api/security/2fa/setup`

> 生成密钥和二维码

---

### 启用2FA

**POST** `/api/security/2fa/enable`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 验证码 |

---

### 禁用2FA

**POST** `/api/security/2fa/disable`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| password | string | 是 | 账户密码 |
| code | string | 是 | 2FA验证码 |

---

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

## DNS记录类型说明

| 类型 | 说明 | content示例 |
|------|------|-------------|
| A | IPv4地址 | 1.2.3.4 |
| AAAA | IPv6地址 | 2001:db8::1 |
| CNAME | 别名记录 | example.com |
| TXT | 文本记录 | v=spf1 include:example.com |
| MX | 邮件记录 | mail.example.com |
| NS | NS记录 | ns1.example.com |
