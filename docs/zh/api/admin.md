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
    "total_income": 10000.00,
    "today_income": 500.00
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

### 解绑用户OAuth

**POST** `/api/admin/users/{user_id}/unbind-oauth`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| provider | string | 是 | github/google/nodeloc |

---

## 渠道管理模块

### 获取服务商列表

**GET** `/api/admin/channels/providers`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "providers": [
      {
        "type": "cloudflare",
        "name": "Cloudflare",
        "credential_fields": [
          {"name": "email", "label": "邮箱", "type": "text"},
          {"name": "api_key", "label": "API Key", "type": "password"}
        ]
      }
    ]
  }
}
```

---

### 获取渠道列表

**GET** `/api/admin/channels`

---

### 添加渠道

**POST** `/api/admin/channels`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 渠道名称 |
| provider_type | string | 是 | 服务商类型 |
| credentials | object | 是 | 凭据信息 |
| remark | string | 否 | 备注 |

---

### 更新渠道

**PUT** `/api/admin/channels/{channel_id}`

---

### 删除渠道

**DELETE** `/api/admin/channels/{channel_id}`

---

### 验证渠道凭据

**POST** `/api/admin/channels/{channel_id}/verify`

---

### 获取渠道域名列表

**GET** `/api/admin/channels/{channel_id}/zones`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| page | int | 否 | 页码 |
| page_size | int | 否 | 每页数量 |

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
| channel_id | int | 是 | 渠道ID |
| name | string | 是 | 域名 |
| zone_id | string | 否 | Zone ID（不填则自动获取） |
| description | string | 否 | 描述 |
| allow_register | bool | 否 | 是否开放注册 |

---

### 更新主域名

**PUT** `/api/admin/domains/{domain_id}`

---

### 删除主域名

**DELETE** `/api/admin/domains/{domain_id}`

> 注意：删除主域名会同时删除该域名下所有二级域名及其DNS记录

---

## 二级域名管理模块

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

### 获取二级域名的DNS记录

**GET** `/api/admin/subdomains/{subdomain_id}/records`

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

> 注意：删除域名会同时删除DNS服务商上的DNS记录

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
| sort_order | int | 否 | 排序值 |

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

### 禁用卡密

**PUT** `/api/admin/redeem-codes/{code_id}/disable`

---

### 批量删除卡密

**POST** `/api/admin/redeem-codes/batch-delete`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 卡密ID数组 |

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
| applicable_type | string | 否 | 适用产品(all/domain/vhost) |
| excluded_domains | array | 否 | 排除的域名ID列表 |
| expires_at | string | 否 | 过期时间 |

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
| subdomain_id | int | 否 | 筛选二级域名 |
| type | string | 否 | 记录类型 |

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
| 参数 | 类型 | 说明 |
|------|------|------|
| site_name | string | 站点名称 |
| site_description | string | 站点描述 |
| site_logo | string | Logo URL |
| site_favicon | string | Favicon URL |
| site_url | string | 站点URL |
| admin_email | string | 管理员邮箱 |
| icp_number | string | 备案号 |
| register_enabled | bool | 是否开放注册 |
| default_max_domains | int | 新用户默认域名配额 |
| smtp_host | string | SMTP服务器 |
| smtp_port | int | SMTP端口 |
| smtp_user | string | SMTP用户名 |
| smtp_password | string | SMTP密码 |
| smtp_ssl | bool | 是否SSL |
| smtp_sender_name | string | 发件人名称 |
| aliyun_dm_enabled | bool | 阿里云邮件推送开关 |
| aliyun_dm_access_key | string | 阿里云AccessKey |
| aliyun_dm_access_secret | string | 阿里云AccessSecret |
| aliyun_dm_region | string | 阿里云区域 |
| aliyun_dm_sender | string | 发信地址 |
| turnstile_enabled | bool | Turnstile开关 |
| turnstile_site_key | string | Turnstile Site Key |
| turnstile_secret_key | string | Turnstile Secret Key |
| captcha_login | bool | 登录验证码开关 |
| captcha_register | bool | 注册验证码开关 |
| captcha_forgot_password | bool | 找回密码验证码开关 |
| captcha_change_password | bool | 修改密码验证码开关 |
| captcha_change_email | bool | 修改邮箱验证码开关 |
| email_suffix_enabled | bool | 邮箱后缀限制开关 |
| email_suffix_mode | string | 模式(whitelist/blacklist) |
| email_suffix_list | string | 后缀列表(每行一个) |
| github_client_id | string | GitHub Client ID |
| github_client_secret | string | GitHub Client Secret |
| google_client_id | string | Google Client ID |
| google_client_secret | string | Google Client Secret |
| nodeloc_client_id | string | NodeLoc Client ID |
| nodeloc_client_secret | string | NodeLoc Client Secret |
| analytics_code | string | 统计代码 |

---

### 测试SMTP

**POST** `/api/admin/settings/test-smtp`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 测试邮箱 |

---

### 测试阿里云邮件

**POST** `/api/admin/settings/test-aliyun-dm`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 测试邮箱 |

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

## 邮件模板管理模块

### 获取邮件模板列表

**GET** `/api/admin/email-templates`

---

### 获取邮件模板详情

**GET** `/api/admin/email-templates/{template_id}`

---

### 更新邮件模板

**PUT** `/api/admin/email-templates/{template_id}`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| subject | string | 否 | 邮件主题 |
| content | string | 否 | 邮件内容 |
| enabled | bool | 否 | 是否启用 |

---

### 重置邮件模板

**POST** `/api/admin/email-templates/{template_id}/reset`

---

### 发送测试邮件

**POST** `/api/admin/email-templates/{template_id}/test`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 测试邮箱 |

---

## APP版本管理模块

### 获取版本列表

**GET** `/api/admin/app-versions`

---

### 创建版本

**POST** `/api/admin/app-versions`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| version | string | 是 | 版本号 |
| version_code | int | 是 | 版本代码 |
| platform | string | 是 | 平台(android/ios) |
| download_url | string | 是 | 下载地址 |
| changelog | string | 否 | 更新日志 |
| force_update | bool | 否 | 是否强制更新 |

---

### 更新版本

**PUT** `/api/admin/app-versions/{version_id}`

---

### 删除版本

**DELETE** `/api/admin/app-versions/{version_id}`

---

## 操作日志模块

### 获取操作日志

**GET** `/api/admin/logs`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| user_id | int | 否 | 用户ID |
| action | string | 否 | 操作类型 |
| target_type | string | 否 | 目标类型 |


---

## 虚拟主机管理模块

### 获取虚拟主机统计

**GET** `/api/admin/vhost/stats`

#### 响应示例
```json
{
  "code": 200,
  "data": {
    "total_income": 10000.00,
    "month_income": 1000.00,
    "instances_count": 50,
    "servers_count": 3
  }
}
```

---

### 服务器管理

#### 获取服务器列表

**GET** `/api/admin/vhost/servers`

---

#### 添加服务器

**POST** `/api/admin/vhost/servers`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 服务器名称 |
| panel_url | string | 是 | 宝塔面板地址 |
| api_key | string | 是 | API Key |
| max_sites | int | 否 | 最大站点数 |
| remark | string | 否 | 备注 |

---

#### 更新服务器

**PUT** `/api/admin/vhost/servers/{server_id}`

---

#### 删除服务器

**DELETE** `/api/admin/vhost/servers/{server_id}`

---

#### 测试服务器连接

**POST** `/api/admin/vhost/servers/{server_id}/test`

---

### 套餐管理

#### 获取套餐列表

**GET** `/api/admin/vhost/plans`

---

#### 创建套餐

**POST** `/api/admin/vhost/plans`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 套餐名称 |
| price | float | 是 | 价格 |
| duration_days | int | 是 | 有效期天数 |
| disk_space | int | 是 | 磁盘空间(MB) |
| bandwidth | int | 是 | 月流量(MB)，-1为无限 |
| max_domains | int | 是 | 最大域名数 |
| max_databases | int | 是 | 最大数据库数 |
| server_id | int | 否 | 指定服务器ID |
| description | string | 否 | 描述 |

---

#### 更新套餐

**PUT** `/api/admin/vhost/plans/{plan_id}`

---

#### 删除套餐

**DELETE** `/api/admin/vhost/plans/{plan_id}`

---

### 主机实例管理

#### 获取实例列表

**GET** `/api/admin/vhost/instances`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| status | int | 否 | 状态筛选 |
| user_id | int | 否 | 用户ID |
| search | string | 否 | 搜索域名 |

---

#### 更新实例

**PUT** `/api/admin/vhost/instances/{instance_id}`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | int | 否 | 状态(0删除/1正常/2暂停) |
| expires_at | string | 否 | 到期时间 |

---

#### 删除实例

**DELETE** `/api/admin/vhost/instances/{instance_id}`

---

#### 批量删除实例

**POST** `/api/admin/vhost/instances/batch-delete`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 实例ID数组 |

---

### 订单管理

#### 获取订单列表

**GET** `/api/admin/vhost/orders`

---

#### 删除订单

**DELETE** `/api/admin/vhost/orders/{order_id}`

---

#### 批量删除订单

**POST** `/api/admin/vhost/orders/batch-delete`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 订单ID数组 |

---

## 托管商管理模块

### 获取托管申请列表

**GET** `/api/admin/host/applications`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码 |
| per_page | int | 否 | 每页数量 |
| status | int | 否 | 状态筛选 |

---

### 审核托管申请

**POST** `/api/admin/host/applications/{application_id}/review`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| action | string | 是 | approve/reject |
| reason | string | 否 | 拒绝原因 |

---

### 获取托管商列表

**GET** `/api/admin/host/hosts`

---

### 更新托管商

**PUT** `/api/admin/host/hosts/{host_id}`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | int | 否 | 状态 |
| commission_rate | float | 否 | 抽成比例 |

---

### 获取托管设置

**GET** `/api/admin/host/settings`

---

### 更新托管设置

**PUT** `/api/admin/host/settings`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| host_enabled | bool | 否 | 是否启用托管功能 |
| host_default_commission | float | 否 | 默认抽成比例 |
| host_min_apply_reason | int | 否 | 申请理由最小字数 |

---

## Telegram机器人管理模块

### 获取Telegram设置

**GET** `/api/admin/telegram/settings`

---

### 更新Telegram设置

**PUT** `/api/admin/telegram/settings`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bot_token | string | 是 | Bot Token |
| enabled | bool | 否 | 是否启用 |

---

### 获取绑定用户列表

**GET** `/api/admin/telegram/users`

---

### 解绑用户

**DELETE** `/api/admin/telegram/users/{user_id}`

---

## 数据导入导出模块

### 导出用户数据

**GET** `/api/admin/export/users`

---

### 导出二级域名数据

**GET** `/api/admin/export/subdomains`

---

### 导出卡密数据

**GET** `/api/admin/export/redeem-codes`

---

### 导入用户数据

**POST** `/api/admin/import/users`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | CSV文件 |

---

### 导入卡密数据

**POST** `/api/admin/import/redeem-codes`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | CSV文件 |

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
