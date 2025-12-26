# 安装指南

本文档介绍如何将文档系统部署到 GitHub Pages。

## 前置要求

- GitHub 账号
- Git 基础知识

## 部署步骤

### 1. Fork 或克隆仓库

```bash
git clone https://github.com/your-username/docs-system.git
cd docs-system
```

### 2. 修改配置

编辑 `config/config.json` 文件：

```json
{
  "title": "你的文档标题",
  "description": "文档描述",
  "defaultLang": "zh",
  "languages": ["zh", "en"],
  "repo": "https://github.com/your-username/your-repo"
}
```

### 3. 添加文档

在 `docs/` 目录下添加 Markdown 文件：

```
docs/
├── zh/
│   └── guide/
│       └── your-doc.md
└── en/
    └── guide/
        └── your-doc.md
```

### 4. 更新导航

编辑 `config/nav.json` 添加新文档的导航链接。

### 5. 启用 GitHub Pages

1. 进入仓库 Settings
2. 找到 Pages 选项
3. Source 选择 `main` 分支
4. 保存并等待部署

## 本地预览

直接在浏览器中打开 `index.html` 文件即可预览。

> **提示**: 由于浏览器安全限制，本地预览时某些功能可能受限。建议使用本地服务器。

## 常见问题

### 文档加载失败

检查文件路径是否正确，确保 Markdown 文件存在于对应目录。

### 搜索不工作

确保已更新 `config/search-index.json` 文件。
