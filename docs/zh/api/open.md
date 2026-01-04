# 开放 API 接口文档

## 概述

开放API允许外部系统通过API Key + 签名认证的方式调用六趣DNS的接口，实现域名管理、DNS记录管理等功能。

- **Base URL**: `/api/open`
- **认证方式**: API Key + HMAC-SHA256 签名
- **响应格式**: JSON

---

## 认证机制

### 获取API密钥

1. 登录六趣DNS用户中心
2. 进入 **安全设置** → **API密钥管理**
3. 点击 **生成API密钥**
4. 保存 `api_key` 和 `api_secret`（api_secret只显示一次）

### 请求头

每个API请求需要包含以下请求头：

| 请求头 | 说明 |
|--------|------|
| X-Api-Key | API Key |
| X-Timestamp | 当前时间戳（秒） |
| X-Signature | 请求签名 |

### 签名算法

签名使用 HMAC-SHA256 算法，签名字符串格式：

```
{timestamp}{method}{path}{body}
```

- `timestamp`: 当前时间戳（秒）
- `method`: 请求方法（大写，如 GET、POST）
- `path`: 请求路径（如 /api/open/user/info）
- `body`: 请求体（GET请求为空字符串）

### 签名示例

**Python 示例**：

```python
import hmac
import hashlib
import time
import requests

api_key = "your_api_key"
api_secret = "your_api_secret"
base_url = "https://your-domain.com"

def make_request(method, path, data=None):
    timestamp = str(int(time.time()))
    body = "" if data is None else json.dumps(data)
    
    # 生成签名
    sign_string = f"{timestamp}{method.upper()}{path}{body}"
    signature = hmac.new(
        api_secret.encode(),
        sign_string.encode(),
        hashlib.sha256
    ).hexdigest()
    
    headers = {
        "X-Api-Key": api_key,
        "X-Timestamp": timestamp,
        "X-Signature": signature,
        "Content-Type": "application/json"
    }
    
    url = base_url + path
    
    if method.upper() == "GET":
        response = requests.get(url, headers=headers)
    elif method.upper() == "POST":
        response = requests.post(url, headers=headers, json=data)
    elif method.upper() == "PUT":
        response = requests.put(url, headers=headers, json=data)
    elif method.upper() == "DELETE":
        response = requests.delete(url, headers=headers)
    
    return response.json()

# 使用示例
result = make_request("GET", "/api/open/user/info")
print(result)
```

**JavaScript 示例**：

```javascript
const crypto = require('crypto');
const axios = require('axios');

const apiKey = 'your_api_key';
const apiSecret = 'your_api_secret';
const baseUrl = 'https://your-domain.com';

async function makeRequest(method, path, data = null) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const body = data ? JSON.stringify(data) : '';
    
    // 生成签名
    const signString = `${timestamp}${method.toUpperCase()}${path}${body}`;
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(signString)
        .digest('hex');
    
    const headers = {
        'X-Api-Key': apiKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json'
    };
    
    const url = baseUrl + path;
    
    const response = await axios({
        method,
        url,
        headers,
        data
    });
    
    return response.data;
}

// 使用示例
makeRequest('GET', '/api/open/user/info').then(console.log);
```

### IP白名单

可在用户中心设置API IP白名单，只允许指定IP调用API。

---

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
  "code": 401,
  "message": "签名验证失败"
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败（API Key无效/签名错误/时间戳过期） |
| 402 | 余额不足 |
| 403 | API未启用/IP不在白名单 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如域名已存在） |
| 500 | 服务器错误 |

---

## 用户信息

### 获取用户信息

**GET** `/api/open/user/info`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "username": "testuser",
    "email": "test@example.com",
    "balance": 100.00,
    "balance_text": "100.00",
    "subdomain_count": 5,
    "max_domains": 10
  }
}
```

---

## 域名管理

### 获取可购买域名列表

**GET** `/api/open/domains`

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
        "plans": [
          {
            "id": 1,
            "name": "基础套餐",
            "price": 10.00,
            "duration_days": 365,
            "max_records": 10,
            "description": "适合个人使用"
          }
        ]
      }
    ]
  }
}
```

---

### 检查子域名可用性

**GET** `/api/open/domains/{domain_id}/check`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 子域名前缀 |

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

### 获取域名套餐列表

**GET** `/api/open/domains/{domain_id}/plans`

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

## 子域名管理

### 获取子域名列表

**GET** `/api/open/subdomains`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| per_page | int | 否 | 每页数量，默认20 |

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "subdomains": [
      {
        "id": 1,
        "name": "test",
        "domain_name": "example.com",
        "full_name": "test.example.com",
        "status": 1,
        "expires_at": "2027-01-04T00:00:00",
        "created_at": "2026-01-04T00:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### 获取子域名详情

**GET** `/api/open/subdomains/{subdomain_id}`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "subdomain": {
      "id": 1,
      "name": "test",
      "domain_name": "example.com",
      "full_name": "test.example.com",
      "status": 1,
      "plan_id": 1,
      "expires_at": "2027-01-04T00:00:00",
      "created_at": "2026-01-04T00:00:00"
    }
  }
}
```

---

### 购买子域名

**POST** `/api/open/purchase`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain_id | int | 是 | 主域名ID |
| name | string | 是 | 子域名前缀 |
| plan_id | int | 是 | 套餐ID |
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
    "balance": 90.00,
    "balance_text": "90.00"
  }
}
```

---

### 续费子域名

**POST** `/api/open/subdomains/{subdomain_id}/renew`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_id | int | 否 | 续费套餐ID（不填使用原套餐） |

#### 响应示例
```json
{
  "code": 200,
  "message": "续费成功",
  "data": {
    "expires_at": "2028-01-04T00:00:00",
    "cost": 10.00,
    "balance": 80.00
  }
}
```

---

### 删除子域名

**DELETE** `/api/open/subdomains/{subdomain_id}`

#### 响应示例
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## DNS记录管理

### 获取DNS记录列表

**GET** `/api/open/subdomains/{subdomain_id}/records`

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
        "proxied": false,
        "created_at": "2026-01-04T00:00:00"
      }
    ]
  }
}
```

---

### 添加DNS记录

**POST** `/api/open/subdomains/{subdomain_id}/records`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 记录类型(A/AAAA/CNAME/TXT/MX/NS) |
| name | string | 否 | 名称前缀，默认@ |
| content | string | 是 | 记录值 |
| ttl | int | 否 | TTL，默认600 |
| proxied | bool | 否 | 是否开启代理（Cloudflare），默认false |

#### 响应示例
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "record": {
      "id": "abc123",
      "type": "A",
      "name": "@",
      "content": "1.2.3.4",
      "ttl": 300,
      "proxied": false
    }
  }
}
```

---

### 更新DNS记录

**PUT** `/api/open/dns-records/{record_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 否 | 记录值 |
| ttl | int | 否 | TTL |
| proxied | bool | 否 | 是否开启代理 |

#### 响应示例
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "record": {
      "id": "abc123",
      "type": "A",
      "name": "@",
      "content": "5.6.7.8",
      "ttl": 600,
      "proxied": false
    }
  }
}
```

---

### 删除DNS记录

**DELETE** `/api/open/dns-records/{record_id}`

#### 响应示例
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## DNS记录类型说明

| 类型 | 说明 | content示例 |
|------|------|-------------|
| A | IPv4地址 | 1.2.3.4 |
| AAAA | IPv6地址 | 2001:db8::1 |
| CNAME | 别名记录 | example.com |
| TXT | 文本记录 | v=spf1 include:example.com |
| MX | 邮件记录 | mail.example.com |
| NS | NS记录 | ns1.example.com |

---

## 错误处理

### 常见错误

| 错误码 | 错误信息 | 说明 |
|--------|----------|------|
| 401 | 缺少认证参数 | 请求头缺少X-Api-Key/X-Timestamp/X-Signature |
| 401 | API Key无效 | API Key不存在 |
| 401 | 签名验证失败 | 签名不正确 |
| 401 | 请求已过期 | 时间戳与服务器时间相差超过5分钟 |
| 403 | API未启用 | 用户未启用API功能 |
| 403 | IP不在白名单中 | 请求IP不在API白名单中 |
| 402 | 余额不足 | 账户余额不足以完成购买 |
| 409 | 子域名已被使用 | 该子域名前缀已被注册 |

### 错误响应示例

```json
{
  "code": 401,
  "message": "签名验证失败"
}
```
