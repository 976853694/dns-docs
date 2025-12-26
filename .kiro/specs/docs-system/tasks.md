# Implementation Plan: 文档系统

## Overview

基于 GitHub Pages 的静态文档系统实现计划。采用渐进式开发，先搭建核心框架，再逐步添加功能模块。

## Tasks

- [x] 1. 项目结构和基础框架
  - [x] 1.1 创建目录结构和配置文件
    - 创建 `config/`、`assets/css/`、`assets/js/`、`docs/zh/`、`docs/en/` 目录
    - 创建 `config/config.json` 站点配置
    - 创建 `config/nav.json` 导航配置
    - _Requirements: 2.1, 6.1_
  - [x] 1.2 创建主入口 HTML 和基础样式
    - 更新 `index.html` 包含文档系统布局
    - 创建 `assets/css/main.css` 主样式（使用 CSS Grid/Flexbox 布局）
    - 添加 viewport meta 标签确保移动端正确缩放
    - 使用相对单位（rem, %, vw/vh）确保自适应
    - _Requirements: 4.1, 4.3_

- [x] 2. 路由模块实现
  - [x] 2.1 实现 Router 模块
    - 创建 `assets/js/router.js`
    - 实现 URL 解析（提取语言和路径）
    - 实现 `navigate()` 导航方法
    - 实现 `onRouteChange()` 监听 hashchange 事件
    - _Requirements: 1.1, 6.2, 6.4_
  - [ ]* 2.2 编写 Router 属性测试
    - **Property 1: 文档路径解析一致性**
    - **Property 8: URL 语言标识**
    - **Validates: Requirements 1.1, 6.2, 6.4**

- [x] 3. Markdown 渲染模块
  - [x] 3.1 实现 Renderer 模块
    - 创建 `assets/js/renderer.js`
    - 集成 marked.js 和 highlight.js（CDN）
    - 实现 Markdown 文件加载和渲染
    - 实现标题锚点生成
    - 实现 TOC 目录生成
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ]* 3.2 编写 Renderer 属性测试
    - **Property 2: Markdown 标题锚点生成**
    - **Property 3: 代码块语法高亮**
    - **Validates: Requirements 1.2, 1.3**
  - [x] 3.3 实现 404 错误页面
    - 创建 404 错误处理逻辑
    - _Requirements: 1.4_

- [ ] 4. Checkpoint - 核心渲染功能验证
  - 确保文档可以正常加载和渲染
  - 确保所有测试通过，如有问题请询问用户

- [x] 5. 侧边栏模块实现
  - [x] 5.1 实现 Sidebar 模块
    - 创建 `assets/js/sidebar.js`
    - 实现导航配置加载和渲染
    - 实现层级目录结构
    - 实现折叠/展开功能
    - 实现当前页面高亮
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ]* 5.2 编写 Sidebar 属性测试
    - **Property 6: 侧边栏当前项高亮**
    - **Validates: Requirements 2.3, 6.3**

- [x] 6. 搜索模块实现
  - [x] 6.1 实现 Search 模块
    - 创建 `assets/js/search.js`
    - 创建 `config/search-index.json` 搜索索引
    - 实现关键词搜索算法
    - 实现搜索结果渲染
    - 实现关键词高亮
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 6.2 编写 Search 属性测试
    - **Property 4: 搜索结果相关性**
    - **Property 5: 搜索关键词高亮**
    - **Validates: Requirements 3.1, 3.2**

- [-] 7. 主题模块实现
  - [x] 7.1 实现 Theme 模块
    - 创建 `assets/js/theme.js`
    - 创建 `assets/css/theme-light.css` 和 `assets/css/theme-dark.css`
    - 实现主题切换逻辑
    - 实现 localStorage 偏好存储
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 7.2 编写 Theme 属性测试
    - **Property 7: 用户偏好 Round-Trip**
    - **Validates: Requirements 5.3, 6.5**

- [ ] 8. Checkpoint - 功能模块验证
  - 确保侧边栏、搜索、主题切换正常工作
  - 确保所有测试通过，如有问题请询问用户

- [ ] 9. 多语言支持
  - [ ] 9.1 实现语言切换功能
    - 在 `app.js` 中添加语言切换逻辑
    - 更新 Sidebar 支持多语言导航
    - 实现语言偏好存储
    - 实现缺失翻译的降级处理
    - _Requirements: 6.2, 6.3, 6.5, 6.6_

- [ ] 10. 响应式设计
  - [ ] 10.1 实现移动端适配
    - 添加响应式 CSS 媒体查询（断点：768px, 1024px, 1280px）
    - 实现侧边栏抽屉模式（移动端）
    - 添加汉堡菜单按钮
    - 实现触摸滑动关闭侧边栏
    - 文档内容区域自适应宽度
    - 代码块横向滚动（移动端）
    - 搜索框自适应布局
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 11. 主应用整合
  - [x] 11.1 创建主应用控制器
    - 创建 `assets/js/app.js`
    - 整合所有模块
    - 实现初始化流程
    - _Requirements: All_

- [x] 12. 示例文档
  - [x] 12.1 创建示例文档内容
    - 创建 `docs/zh/guide/getting-started.md`
    - 创建 `docs/zh/guide/installation.md`
    - 创建 `docs/en/guide/getting-started.md`
    - 创建 `docs/en/guide/installation.md`
    - _Requirements: 6.1_

- [ ] 13. Final Checkpoint - 完整功能验证
  - 确保所有功能正常工作
  - 确保所有测试通过
  - 如有问题请询问用户

## Notes

- 任务标记 `*` 的为可选测试任务，可跳过以加快 MVP 开发
- 使用 CDN 引入 marked.js 和 highlight.js，无需构建工具
- 属性测试使用 fast-check 库
- 每个属性测试至少运行 100 次迭代
