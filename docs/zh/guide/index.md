# 六趣DNS - 文档中心

## 快速导航

| 文档 | 说明 |
|------|------|
| [安装部署](#/zh/guide/installation) | Docker Compose 部署指南 |
| [使用指南](#/zh/guide/usage) | 管理员配置和用户使用说明 |
| [更新升级](#/zh/guide/update) | 版本更新和回滚指南 |
| [APP 客户端](#/zh/guide/app) | 多平台客户端使用说明 |
| [用户端 API](#/zh/api/user) | 用户端接口文档 |
| [管理端 API](#/zh/api/admin) | 管理后台接口文档 |

---

## 快速开始

### 1. 部署系统

```bash
# 创建目录
mkdir dns && cd dns

# 创建 docker-compose.yml（参考安装文档）

# 启动服务
docker compose up -d
```

### 2. 初始配置

1. 访问 http://服务器IP:5000/admin
2. 登录：`admin@qq.com` / `admin123`
3. 修改管理员密码
4. 添加 Cloudflare 账户
5. 添加主域名
6. 创建套餐

### 3. 更新系统

```bash
docker compose pull && docker compose down && docker compose up -d
```

---

## 功能概览

### 用户端功能

- ✅ 域名购买 - 选择套餐购买二级域名
- ✅ DNS 管理 - A/AAAA/CNAME/TXT/MX 记录
- ✅ NS 托管 - 切换到自定义 NS 服务器
- ✅ 余额充值 - 卡密充值系统
- ✅ 域名续费 - 手动/自动续费
- ✅ 安全设置 - 2FA、IP 白名单

### 管理端功能

- ✅ 多 CF 账户 - 支持多个 Cloudflare 账户
- ✅ 域名管理 - 主域名和二级域名管理
- ✅ 套餐管理 - 灵活的套餐配置
- ✅ 用户管理 - 用户列表、余额调整
- ✅ 卡密管理 - 批量生成、导出
- ✅ 优惠券 - 折扣券、满减券
- ✅ 公告系统 - 置顶、弹窗公告
- ✅ 数据统计 - 可视化图表

### 自动化功能

- ✅ 到期提醒 - 7天/3天/1天邮件提醒
- ✅ 自动停用 - 到期域名自动停用
- ✅ 记录清理 - 过期域名 DNS 记录清理

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 后端 | Python 3.9+ / Flask 3.0 |
| 数据库 | MySQL 8.0+ |
| 前端 | TailwindCSS / Alpine.js |
| 认证 | JWT / TOTP 2FA |
| DNS | Cloudflare API v4 |
| 部署 | Docker / Docker Compose |

---

## 获取帮助

- **GitHub**: https://github.com/976853694/cloudflare-DNS
- **QQ 交流群**: https://qm.qq.com/q/nMNgw1CB7q
- **问题反馈**: 提交 GitHub Issue

---

## 版本信息

- **当前版本**: v2.7
- **更新时间**: 2025年12月
