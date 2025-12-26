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
    "today_logins": 50
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

## 套餐管理模块

### 获取套餐列表

**GET** `/api/admin/plans`

---

### 创建套餐

**POST** `/api/admin/plans`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain_ids | array | 是 | 域名ID数组（支持多域名） |
| name | string | 是 | 套餐名称 |
| price | float | 否 | 价格，默认0 |
| duration_days | int | 否 | 有效天数(-1为永久)，默认30 |
| min_length | int | 否 | 最小长度，默认1 |
| max_length | int | 否 | 最大长度，默认63 |
| max_records | int | 否 | 最大记录数(-1为无限)，默认10 |
| description | string | 否 | 套餐描述 |

---

### 更新套餐

**PUT** `/api/admin/plans/{plan_id}`

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

### 导出卡密

**GET** `/api/admin/redeem-codes/export`

---

## 优惠券管理模块

### 获取优惠券列表

**GET** `/api/admin/coupons`

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
| total_count | int | 否 | 总数量(-1为无限)，默认-1 |
| per_user_limit | int | 否 | 每人限用次数，默认1 |

---

### 更新优惠券

**PUT** `/api/admin/coupons/{coupon_id}`

---

### 删除优惠券

**DELETE** `/api/admin/coupons/{coupon_id}`


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

---

### 删除DNS记录

**DELETE** `/api/admin/dns-records/{record_id}`

---

## 公告管理模块

### 获取公告列表

**GET** `/api/admin/announcements`

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
| admin_email | string | 否 | 管理员邮箱 |
| smtp_host | string | 否 | SMTP服务器 |
| smtp_port | string | 否 | SMTP端口 |
| smtp_user | string | 否 | SMTP用户名 |
| smtp_password | string | 否 | SMTP密码 |
| smtp_ssl | string | 否 | 是否SSL(0/1) |

---

### 测试SMTP

**POST** `/api/admin/settings/test-smtp`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 测试邮箱 |

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

## IP黑名单管理模块

### 获取IP黑名单列表

**GET** `/api/admin/ip-blacklist`

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
