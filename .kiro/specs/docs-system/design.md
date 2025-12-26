# Design Document: 文档系统

## Overview

基于 GitHub Pages 的纯前端静态文档系统，使用原生 JavaScript 实现，无需构建工具。通过 fetch API 动态加载 Markdown 文件，使用 marked.js 渲染，支持多语言、搜索、主题切换等功能。

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Router  │  │ Sidebar │  │ Search  │  │ Theme   │    │
│  │ Module  │  │ Module  │  │ Module  │  │ Module  │    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │
│       │            │            │            │          │
│  ┌────┴────────────┴────────────┴────────────┴────┐    │
│  │              Core Application                   │    │
│  │         (app.js - 主控制器)                     │    │
│  └────────────────────┬───────────────────────────┘    │
│                       │                                 │
│  ┌────────────────────┴───────────────────────────┐    │
│  │           Markdown Renderer                     │    │
│  │         (marked.js + highlight.js)              │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│                   Static Files (GitHub Pages)           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │  /docs  │  │ /config │  │ /assets │                 │
│  │  /*.md  │  │  /*.json│  │ /css,js │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Router Module (router.js)

负责 URL 解析和页面导航。

```javascript
// 接口定义
const Router = {
  // 初始化路由
  init(config) {},
  
  // 解析当前 URL，返回 {lang, path}
  parseUrl() {},
  
  // 导航到指定路径
  navigate(lang, path) {},
  
  // 监听路由变化
  onRouteChange(callback) {}
};
```

### 2. Sidebar Module (sidebar.js)

管理侧边栏导航。

```javascript
// 接口定义
const Sidebar = {
  // 根据配置渲染侧边栏
  render(navConfig, currentPath) {},
  
  // 切换目录折叠状态
  toggleFolder(folderId) {},
  
  // 高亮当前页面
  highlightCurrent(path) {},
  
  // 移动端显示/隐藏
  toggle() {}
};
```

### 3. Search Module (search.js)

提供文档搜索功能。

```javascript
// 接口定义
const Search = {
  // 初始化搜索索引
  init(searchIndex) {},
  
  // 执行搜索，返回结果数组
  search(keyword) {},
  
  // 渲染搜索结果
  renderResults(results) {},
  
  // 高亮关键词
  highlightKeyword(text, keyword) {}
};
```

### 4. Theme Module (theme.js)

管理主题切换。

```javascript
// 接口定义
const Theme = {
  // 初始化主题（读取用户偏好）
  init() {},
  
  // 切换主题
  toggle() {},
  
  // 设置指定主题
  set(themeName) {},
  
  // 获取当前主题
  get() {}
};
```

### 5. Markdown Renderer (renderer.js)

渲染 Markdown 内容。

```javascript
// 接口定义
const Renderer = {
  // 加载并渲染 Markdown 文件
  async render(filePath) {},
  
  // 生成目录 TOC
  generateTOC(content) {},
  
  // 处理代码高亮
  highlightCode(code, language) {}
};
```

## Data Models

### 导航配置 (nav.json)

```json
{
  "zh": {
    "title": "文档",
    "items": [
      {
        "text": "指南",
        "children": [
          { "text": "快速开始", "link": "/guide/getting-started" },
          { "text": "安装", "link": "/guide/installation" }
        ]
      },
      {
        "text": "API 参考",
        "link": "/api/"
      }
    ]
  },
  "en": {
    "title": "Documentation",
    "items": [
      {
        "text": "Guide",
        "children": [
          { "text": "Getting Started", "link": "/guide/getting-started" },
          { "text": "Installation", "link": "/guide/installation" }
        ]
      }
    ]
  }
}
```

### 搜索索引 (search-index.json)

```json
{
  "zh": [
    {
      "title": "快速开始",
      "path": "/guide/getting-started",
      "content": "文档内容摘要...",
      "keywords": ["安装", "配置", "入门"]
    }
  ],
  "en": [
    {
      "title": "Getting Started",
      "path": "/guide/getting-started",
      "content": "Document content summary...",
      "keywords": ["install", "config", "start"]
    }
  ]
}
```

### 站点配置 (config.json)

```json
{
  "title": "My Docs",
  "description": "项目文档",
  "defaultLang": "zh",
  "languages": ["zh", "en"],
  "themeColor": "#3498db",
  "repo": "https://github.com/user/repo"
}
```

## File Structure

```
/
├── index.html              # 主入口页面
├── config/
│   ├── config.json         # 站点配置
│   ├── nav.json            # 导航配置
│   └── search-index.json   # 搜索索引
├── assets/
│   ├── css/
│   │   ├── main.css        # 主样式
│   │   ├── theme-light.css # 亮色主题
│   │   └── theme-dark.css  # 暗色主题
│   └── js/
│       ├── app.js          # 主应用
│       ├── router.js       # 路由模块
│       ├── sidebar.js      # 侧边栏模块
│       ├── search.js       # 搜索模块
│       ├── theme.js        # 主题模块
│       └── renderer.js     # 渲染模块
├── docs/
│   ├── zh/
│   │   ├── guide/
│   │   │   ├── getting-started.md
│   │   │   └── installation.md
│   │   └── api/
│   │       └── index.md
│   └── en/
│       ├── guide/
│       │   ├── getting-started.md
│       │   └── installation.md
│       └── api/
│           └── index.md
└── README.md
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 文档路径解析一致性

*For any* 有效的语言代码和文档路径组合，Router 解析 URL 后应返回正确的 `{lang, path}` 对象，且使用该对象构建的文件路径应指向正确的 Markdown 文件。

**Validates: Requirements 1.1, 6.2, 6.4**

### Property 2: Markdown 标题锚点生成

*For any* 包含标题的 Markdown 内容，渲染后的 HTML 中每个标题元素都应包含唯一的 `id` 属性，且该 `id` 应由标题文本转换而来（小写、空格转连字符）。

**Validates: Requirements 1.3**

### Property 3: 代码块语法高亮

*For any* 包含带语言标识代码块的 Markdown 内容，渲染后的 HTML 中代码块应包含 `hljs` 相关的 CSS 类名。

**Validates: Requirements 1.2**

### Property 4: 搜索结果相关性

*For any* 搜索关键词和搜索索引，返回的所有结果都应在 `title`、`content` 或 `keywords` 中包含该关键词（不区分大小写）。

**Validates: Requirements 3.1**

### Property 5: 搜索关键词高亮

*For any* 搜索结果文本和关键词，高亮处理后的文本应包含 `<mark>` 标签包裹的关键词，且原始文本内容不变。

**Validates: Requirements 3.2**

### Property 6: 侧边栏当前项高亮

*For any* 导航配置和当前路径，侧边栏渲染后应有且仅有一个导航项具有 `active` 类名，且该项的 `link` 属性应与当前路径匹配。

**Validates: Requirements 2.3, 6.3**

### Property 7: 用户偏好 Round-Trip

*For any* 有效的主题名称或语言代码，存储到 localStorage 后再读取，应得到相同的值。

**Validates: Requirements 5.3, 6.5**

### Property 8: URL 语言标识

*For any* 语言代码和文档路径，生成的 URL 应以 `/{lang}/` 开头，且解析该 URL 应还原出原始的语言代码和路径。

**Validates: Requirements 6.4**

## Error Handling

### 文档加载错误

| 错误场景 | 处理方式 |
|---------|---------|
| Markdown 文件不存在 | 显示 404 页面，提供返回首页链接 |
| 网络请求失败 | 显示错误提示，提供重试按钮 |
| Markdown 解析失败 | 显示原始文本，记录错误日志 |

### 配置加载错误

| 错误场景 | 处理方式 |
|---------|---------|
| nav.json 加载失败 | 隐藏侧边栏，显示错误提示 |
| search-index.json 加载失败 | 禁用搜索功能，显示提示 |
| config.json 加载失败 | 使用默认配置 |

### 语言切换错误

| 错误场景 | 处理方式 |
|---------|---------|
| 目标语言文档不存在 | 显示默认语言文档，顶部显示提示条 |
| 无效的语言代码 | 重定向到默认语言 |

## Testing Strategy

### 单元测试

使用 Jest 进行单元测试，覆盖以下模块：

- **Router**: URL 解析、路径构建
- **Search**: 搜索算法、关键词高亮
- **Theme**: 主题切换、偏好存储
- **Renderer**: Markdown 渲染、TOC 生成

### 属性测试

使用 fast-check 进行属性测试，每个属性至少运行 100 次迭代：

```javascript
// 示例：Property 4 - 搜索结果相关性
fc.assert(
  fc.property(
    fc.string({ minLength: 1 }),  // 关键词
    fc.array(searchEntryArb),      // 搜索索引
    (keyword, index) => {
      const results = Search.search(keyword, index);
      return results.every(r => 
        r.title.toLowerCase().includes(keyword.toLowerCase()) ||
        r.content.toLowerCase().includes(keyword.toLowerCase()) ||
        r.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
      );
    }
  ),
  { numRuns: 100 }
);
```

### 测试文件结构

```
/tests/
├── unit/
│   ├── router.test.js
│   ├── search.test.js
│   ├── theme.test.js
│   └── renderer.test.js
└── property/
    ├── router.property.test.js
    ├── search.property.test.js
    └── theme.property.test.js
```

## Dependencies

| 库 | 版本 | 用途 |
|---|-----|-----|
| marked | ^12.0.0 | Markdown 解析 |
| highlight.js | ^11.9.0 | 代码语法高亮 |
| fast-check | ^3.15.0 | 属性测试（开发依赖） |
| jest | ^29.7.0 | 单元测试（开发依赖） |
