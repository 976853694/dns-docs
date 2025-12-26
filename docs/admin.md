# 管理端 API 接口文档

## 概述

- **Base URL**: `/api/admin`
- **认证方式**: JWT Bearer Token
- **权限要求**: 管理员角色 (role = admin)
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
  "code": 403,
  "message": "权限不足"
}
```

---

## 统计模块

### 获取系统统计

**GET** `/api/admin/stats`

#### 请求头
```
Authorization: Bearer <access_token>
```

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "users_count": 100,
    "domains_count": 5,
    "subdomains_count": 500,
    "records_count": 1500,
    "today_new_users": 10,
    "today_new_subdomains": 25,
    "today_logins": 50,
    "redeem_codes_total": 200,
    "redeem_codes_unused": 150,
    "redeem_codes_used": 50,
    "plans_count": 10,
    "cf_accounts_count": 2,
    "expiring_soon": 5
  }
}
```

---

## 图表数据模块

### 获取概览图表数据

**GET** `/api/admin/charts/overview`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| days | int | 否 | 天数，默认7 |

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "dates": ["2024-01-01", "2024-01-02", ...],
    "users": [5, 8, 3, ...],
    "subdomains": [10, 15, 8, ...],
    "income": [50.00, 80.00, 30.00, ...]
  }
}
```

---

### 获取用户分布数据

**GET** `/api/admin/charts/user-distribution`

---

### 获取域名统计数据

**GET** `/api/admin/charts/subdomain-stats`

---

### 获取收入统计数据

**GET** `/api/admin/charts/income-stats`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| days | int | 否 | 天数，默认30 |

---

### 获取活动统计

**GET** `/api/admin/charts/activity`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| days | int | 否 | 天数，默认7 |

---

## 用户管理模块

### 获取用户列表

**GET** `/api/admin/users`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| per_page | int | 否 | 每页数量，默认20 |
| search | string | 否 | 搜索关键词(用户名/邮箱) |
| status | int | 否 | 用户状态筛选 |

---

### 获取用户详情

**GET** `/api/admin/users/{user_id}`

---

### 更新用户

**PUT** `/api/admin/users/{user_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 否 | 用户名 |
| email | string | 否 | 邮箱 |
| status | int | 否 | 状态(0禁用/1正常) |
| role | string | 否 | 角色(user/admin) |
| max_domains | int | 否 | 最大域名数 |
| password | string | 否 | 重置密码 |
| balance | float | 否 | 余额 |

---

### 删除用户

**DELETE** `/api/admin/users/{user_id}`

> 注意：删除用户会同时删除该用户的所有域名和DNS记录

---

## 主域名管理模块

### 获取所有主域名

**GET** `/api/admin/domains`

---

### 添加主域名

**POST** `/api/admin/domains`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cf_account_id | int | 是 | Cloudflare账户ID |
| name | string | 是 | 域名 |
| cf_zone_id | string | 是 | Cloudflare Zone ID |
| allow_register | bool | 否 | 是否开放注册，默认true |

---

### 更新主域名

**PUT** `/api/admin/domains/{domain_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| allow_register | bool | 否 | 是否开放注册 |
| status | int | 否 | 状态(0禁用/1正常) |

---

### 删除主域名

**DELETE** `/api/admin/domains/{domain_id}`

> 注意：删除主域名会同时删除该域名下所有二级域名及其DNS记录

---

## Cloudflare账户管理模块

### 获取CF账户列表

**GET** `/api/admin/cf-accounts`

---

### 添加CF账户

**POST** `/api/admin/cf-accounts`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 账户名称 |
| email | string | 是 | Cloudflare邮箱 |
| auth_type | string | 是 | 认证方式(api_key/api_token) |
| api_key | string | 否 | Global API Key(api_key方式) |
| api_token | string | 否 | API Token(api_token方式) |

---

### 更新CF账户

**PUT** `/api/admin/cf-accounts/{account_id}`

---

### 删除CF账户

**DELETE** `/api/admin/cf-accounts/{account_id}`

> 注意：需先删除该账户下的所有域名

---

### 获取CF账户的Zone列表

**GET** `/api/admin/cf-accounts/{account_id}/zones`

---

## 套餐管理模块

### 获取套餐列表

**GET** `/api/admin/plans`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain_id | int | 否 | 筛选包含指定域名的套餐 |

#### 响应示例
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "基础套餐",
        "domain_ids": [1, 2, 3],
        "domain_names": ["example.com", "test.com", "demo.com"],
        "domain_id": 1,
        "domain_name": "example.com, test.com, demo.com",
        "price": 10.00,
        "duration_days": 30,
        "duration_text": "30天",
        "min_length": 1,
        "max_length": 63,
        "max_records": 10,
        "max_records_text": "10条",
        "description": "基础套餐描述",
        "status": 1,
        "sort_order": 0,
        "created_at": "2024-01-01T00:00:00"
      }
    ]
  }
}
```

---

### 创建套餐

**POST** `/api/admin/plans`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain_ids | array | 是* | 域名ID数组（支持多域名） |
| domain_id | int | 是* | 域名ID（兼容旧版，与domain_ids二选一） |
| name | string | 是 | 套餐名称 |
| price | float | 否 | 价格，默认0 |
| duration_days | int | 否 | 有效天数(-1为永久)，默认30 |
| min_length | int | 否 | 最小长度，默认1 |
| max_length | int | 否 | 最大长度，默认63 |
| max_records | int | 否 | 最大记录数(-1为无限)，默认10 |
| description | string | 否 | 套餐描述 |
| sort_order | int | 否 | 排序权重，默认0 |

#### 请求示例
```json
{
  "domain_ids": [1, 2, 3],
  "name": "多域名套餐",
  "price": 29.99,
  "duration_days": 365,
  "max_records": -1
}
```

---

### 更新套餐

**PUT** `/api/admin/plans/{plan_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain_ids | array | 否 | 域名ID数组（更新关联域名） |
| name | string | 否 | 套餐名称 |
| price | float | 否 | 价格 |
| duration_days | int | 否 | 有效天数 |
| min_length | int | 否 | 最小长度 |
| max_length | int | 否 | 最大长度 |
| max_records | int | 否 | 最大记录数 |
| description | string | 否 | 套餐描述 |
| status | int | 否 | 状态(0禁用/1启用) |
| sort_order | int | 否 | 排序权重 |

---

### 删除套餐

**DELETE** `/api/admin/plans/{plan_id}`

---

## 卡密管理模块

### 获取卡密列表

**GET** `/api/admin/redeem-codes`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| status | int | 否 | 状态(0未使用/1已使用/2已禁用) |
| batch_no | string | 否 | 批次号 |
| search | string | 否 | 搜索卡密码 |

---

### 批量生成卡密

**POST** `/api/admin/redeem-codes/generate`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| amount | float | 是 | 充值金额(-1为无限余额) |
| count | int | 否 | 生成数量(1-100)，默认1 |
| expires_days | int | 否 | 过期天数 |

---

### 更新卡密状态

**PUT** `/api/admin/redeem-codes/{code_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | int | 否 | 状态(0未使用/2禁用) |

---

### 删除卡密

**DELETE** `/api/admin/redeem-codes/{code_id}`

---

### 批量删除卡密

**POST** `/api/admin/redeem-codes/batch-delete`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| batch_no | string | 否 | 按批次号删除(只删除未使用的) |
| ids | array | 否 | 按ID列表删除 |

---

### 导出卡密

**GET** `/api/admin/redeem-codes/export`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| batch_no | string | 否 | 批次号 |
| status | int | 否 | 状态 |

---

## 优惠券管理模块

### 获取优惠券列表

**GET** `/api/admin/coupons`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| status | int | 否 | 状态筛选 |
| search | string | 否 | 搜索优惠码/名称 |

---

### 创建优惠券

**POST** `/api/admin/coupons`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 优惠券名称 |
| code | string | 否 | 优惠码(不填自动生成) |
| type | string | 否 | 类型(percent/fixed)，默认percent |
| value | float | 是 | 优惠值(百分比或固定金额) |
| min_amount | float | 否 | 最低消费，默认0 |
| max_discount | float | 否 | 最大优惠金额 |
| total_count | int | 否 | 总数量(-1为无限)，默认-1 |
| per_user_limit | int | 否 | 每人限用次数，默认1 |
| starts_at | string | 否 | 开始时间(ISO格式) |
| expires_at | string | 否 | 过期时间(ISO格式) |

---

### 更新优惠券

**PUT** `/api/admin/coupons/{coupon_id}`

---

### 删除优惠券

**DELETE** `/api/admin/coupons/{coupon_id}`

---

### 获取优惠券使用记录

**GET** `/api/admin/coupons/{coupon_id}/usages`

---

## 订单管理模块

### 获取购买记录列表

**GET** `/api/admin/purchase-records`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| per_page | int | 否 | 每页数量，默认20 |
| user_id | int | 否 | 按用户ID筛选 |
| search | string | 否 | 搜索(域名/套餐名) |

---

### 删除购买记录

**DELETE** `/api/admin/purchase-records/{record_id}`

---

### 批量删除购买记录

**POST** `/api/admin/purchase-records/batch-delete`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 记录ID数组 |

---

## DNS记录管理模块

### 获取所有DNS记录

**GET** `/api/admin/dns-records`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain_id | int | 否 | 筛选主域名 |
| source | string | 否 | 来源(system/cloudflare/all) |

---

### 更新DNS记录

**PUT** `/api/admin/dns-records/{record_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 否 | 记录值 |
| ttl | int | 否 | TTL |
| proxied | bool | 否 | 是否代理 |

---

### 删除DNS记录

**DELETE** `/api/admin/dns-records/{record_id}`

---

## 公告管理模块

### 获取公告列表

**GET** `/api/admin/announcements`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| status | int | 否 | 状态筛选 |

---

### 创建公告

**POST** `/api/admin/announcements`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 标题 |
| content | string | 是 | 内容 |
| type | string | 否 | 类型(info/warning/success/error)，默认info |
| is_pinned | bool | 否 | 是否置顶，默认false |
| is_popup | bool | 否 | 是否弹窗显示，默认false |
| status | int | 否 | 状态(0草稿/1发布)，默认1 |

---

### 更新公告

**PUT** `/api/admin/announcements/{ann_id}`

---

### 删除公告

**DELETE** `/api/admin/announcements/{ann_id}`

---

## 系统设置模块

### 获取系统设置

**GET** `/api/admin/settings`

---

### 更新系统设置

**PUT** `/api/admin/settings`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| site_name | string | 否 | 站点名称 |
| site_description | string | 否 | 站点描述 |
| site_logo | string | 否 | Logo URL |
| site_favicon | string | 否 | Favicon URL |
| admin_email | string | 否 | 管理员邮箱 |
| smtp_host | string | 否 | SMTP服务器 |
| smtp_port | string | 否 | SMTP端口 |
| smtp_user | string | 否 | SMTP用户名 |
| smtp_password | string | 否 | SMTP密码 |
| smtp_ssl | string | 否 | 是否SSL(0/1) |
| redeem_channel_text | string | 否 | 卡密渠道按钮文字 |
| redeem_channel_url | string | 否 | 卡密渠道链接 |

---

### 测试SMTP

**POST** `/api/admin/settings/test-smtp`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 测试邮箱 |

---

## 操作日志模块

### 获取操作日志

**GET** `/api/admin/logs`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| action | string | 否 | 操作类型筛选 |

---

### 删除单条日志

**DELETE** `/api/admin/logs/{log_id}`

---

### 批量删除日志

**POST** `/api/admin/logs/batch-delete`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 否 | 日志ID数组 |
| clear_all | bool | 否 | 是否清空所有日志 |

---

## 用户域名管理模块

### 获取所有二级域名

**GET** `/api/admin/subdomains`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| user_id | int | 否 | 按用户筛选 |
| domain_id | int | 否 | 按主域名筛选 |
| status | int | 否 | 状态筛选 |
| search | string | 否 | 搜索域名 |
| expired | string | 否 | 是否过期(1=已过期/0=未过期) |

---

### 获取二级域名详情

**GET** `/api/admin/subdomains/{subdomain_id}`

---

### 更新二级域名

**PUT** `/api/admin/subdomains/{subdomain_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | int | 否 | 状态(0禁用/1正常/2待审核) |
| expires_at | string | 否 | 到期时间(ISO格式) |
| extend_days | int | 否 | 延期天数 |

---

### 删除二级域名

**DELETE** `/api/admin/subdomains/{subdomain_id}`

> 注意：删除域名会同时删除Cloudflare上的DNS记录

---

### 批量删除二级域名

**POST** `/api/admin/subdomains/batch-delete`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 域名ID数组 |

---

### 批量更新二级域名

**POST** `/api/admin/subdomains/batch-update`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 域名ID数组 |
| status | int | 否 | 状态 |
| extend_days | int | 否 | 延期天数 |

---

### 发送到期提醒邮件

**POST** `/api/admin/subdomains/{subdomain_id}/send-expiry-email`

---

### 清理域名DNS记录

**POST** `/api/admin/subdomains/{subdomain_id}/clear-dns`

> 清理该域名的所有DNS记录

---

## IP黑名单管理模块

### 获取IP黑名单列表

**GET** `/api/admin/ip-blacklist`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| search | string | 否 | 搜索IP |

---

### 添加IP到黑名单

**POST** `/api/admin/ip-blacklist`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ip_address | string | 是 | IP地址 |
| reason | string | 否 | 封禁原因 |
| duration_days | int | 否 | 封禁天数(不填为永久) |

---

### 从黑名单移除IP

**DELETE** `/api/admin/ip-blacklist/{id}`

---

### 检查IP是否被封禁

**GET** `/api/admin/ip-blacklist/check`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ip | string | 是 | IP地址 |

---

## 数据导入导出模块

### 批量导入用户

**POST** `/api/admin/import/users`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| csv_content | string | 是 | CSV数据内容 |
| default_password | string | 否 | 默认密码，默认123456 |

---

### 批量导入卡密

**POST** `/api/admin/import/redeem-codes`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| csv_content | string | 是 | CSV数据内容 |

---

### 导出用户CSV

**GET** `/api/admin/export/users`

> 返回CSV文件下载

---

### 导出二级域名CSV

**GET** `/api/admin/export/subdomains`

> 返回CSV文件下载

---

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token无效 |
| 403 | 权限不足(非管理员) |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器错误 |
