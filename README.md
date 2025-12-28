# DNS Docs

DNS 文档系统 - 基于 GitHub Pages 的静态文档站点。

## 🌐 在线访问

部署后可通过以下地址访问：


## ✨ 功能特性

- 📝 Markdown 文档支持
- 🔍 全文搜索
- 🌙 明暗主题切换
- 🌐 中英文双语
- 📱 响应式设计

## 📁 项目结构

```
├── index.html          # 主入口
├── config/             # 配置文件
│   ├── config.json     # 站点配置
│   ├── nav.json        # 导航配置
│   └── search-index.json
├── assets/             # 静态资源
│   ├── css/
│   └── js/
└── docs/               # 文档内容
    ├── zh/             # 中文文档
    └── en/             # 英文文档
```

## 🚀 部署

1. Fork 本仓库
2. 进入 Settings → Pages
3. Source 选择 `main` 分支
4. 保存等待部署

## 📝 添加文档

1. 在 `docs/zh/` 或 `docs/en/` 下添加 `.md` 文件
2. 更新 `config/nav.json` 添加导航
3. 更新 `config/search-index.json` 添加搜索索引

## 📄 License

MIT
