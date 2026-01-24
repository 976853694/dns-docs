# 六趣DNS - 文档中心

## 项目简介

六趣DNS是一个基于Flask的多服务商二级域名分发系统，支持13种DNS服务商，提供用户自助注册、域名申请、DNS解析管理、虚拟主机分发、域名托管商系统等功能。

**GitHub**: https://github.com/976853694/cloudflare-DNS

**QQ交流群**: https://qm.qq.com/q/nMNgw1CB7q

---

## 快速导航

| 文档 | 说明 |
|------|------|
| [安装部署](#/zh/guide/installation) | Docker Compose 部署指南 |
| [更新升级](#/zh/guide/update) | 版本更新和回滚指南 |


---

## 功能特性

### 用户端功能

| 功能 | 说明 |
|------|------|
| 🌐 域名购买 | 选择套餐购买二级域名，支持永久/限时套餐 |
| 📝 DNS解析管理 | 支持 A、AAAA、CNAME、TXT、MX、NS、SRV、CAA 等记录类型 |
| 🔄 NS托管 | 切换到自定义NS服务器 |
| 💰 余额系统 | 卡密充值，余额支付，优惠券折扣 |
| 🔁 域名续费 | 手动续费和自动续费 |
| 👤 个人中心 | 账户信息、修改密码、修改邮箱 |
| 📧 邮箱验证 | 注册、找回密码均支持邮件验证 |
| 🔐 双因素认证 | TOTP 2FA 安全保护 |
| 🔑 开放API | 支持外部系统对接，API Key + 签名认证 |
| 🖥️ 虚拟主机 | 购买和管理虚拟主机，支持文件管理、SSL证书 |
| 🔗 OAuth登录 | 支持 GitHub、Google、NodeLoc 快捷登录 |

### 管理端功能

| 功能 | 说明 |
|------|------|
| 🏢 渠道管理 | 支持13种DNS服务商，统一管理凭据 |
| 🌍 域名管理 | 添加/管理主域名，关联渠道账户 |
| 📦 套餐管理 | 为每个域名设置不同价格和时长的套餐 |
| 👥 用户管理 | 用户列表、状态管理、余额调整 |
| 🎫 卡密管理 | 批量生成、导出、禁用卡密 |
| 🎁 优惠券管理 | 折扣券、满减券，支持排除域名 |
| 📢 公告系统 | 发布公告，支持置顶和弹窗 |
| ✉️ 邮件模板 | 自定义各类邮件内容 |
| ⚙️ 系统设置 | 站点信息、注册开关、SMTP、验证码、OAuth配置 |
| 📊 数据统计 | 用户数、域名数、订单数等可视化图表 |
| 🖥️ 虚拟主机管理 | 服务器管理、套餐管理、主机实例管理 |
| 🏪 托管商系统 | 域名托管商申请、审核、收益分成 |
| 🤖 Telegram机器人 | 用户绑定、域名购买、余额查询 |
| 📱 APP版本管理 | 版本发布、强制更新设置 |
| 🚫 IP黑名单 | IP封禁管理 |

---

## 支持的DNS服务商

| 服务商 | 类型标识 | 说明 |
|--------|----------|------|
| Cloudflare | cloudflare | 全球CDN，支持代理模式 |
| 阿里云DNS | aliyun | 国内主流，支持线路解析 |
| 腾讯云DNSPod | dnspod | 国内主流，支持线路和权重 |
| 华为云DNS | huawei | 国内云服务商 |
| 西部数码 | west | 国内域名服务商 |
| AWS Route53 | route53 | 亚马逊云DNS服务，支持权重路由 |
| GoDaddy | godaddy | 国际域名注册商 |
| Namecheap | namecheap | 国际域名注册商 |
| Name.com | namecom | 国际域名服务商 |
| 百度智能云 | baidu | 国内云服务商 |
| NameSilo | namesilo | 国际域名注册商 |
| 六趣DNS | liuqu | 支持对接其他六趣DNS实例（分销模式） |
| PowerDNS | powerdns | 自建DNS服务器，完全自主可控 |

---

## 技术栈

| 类型 | 技术 |
|------|------|
| 后端 | Python 3.9+ / Flask 3.0 / SQLAlchemy |
| 数据库 | MySQL 8.0+ / Redis |
| 前端 | TailwindCSS / Alpine.js |
| 认证 | JWT (Flask-JWT-Extended) / TOTP 2FA |
| 验证码 | 图形验证码 / Cloudflare Turnstile |
| 邮件 | SMTP (SSL/TLS) / 阿里云邮件推送 |
| 部署 | Docker / Docker Compose |
| APP | uni-app (Vue.js) |

---


## 获取帮助

- **GitHub**: https://github.com/976853694/cloudflare-DNS
- **QQ 交流群**: https://qm.qq.com/q/nMNgw1CB7q
- **问题反馈**: 提交 GitHub Issue

---

## 版本信息

- **当前版本**: v3.0
- **更新时间**: 2026年1月
