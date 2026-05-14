# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

双碳管理系统（Carbon Admin）前端，基于 RuoYi-Vue 脚手架开发的碳排放管理企业后台。后端为 Spring Boot 服务（端口 9090）。

## 常用命令

```bash
pnpm install              # 安装依赖
pnpm run dev              # 启动开发服务器（端口 80，代理 /dev-api → localhost:9090）
pnpm run build:prod       # 生产构建
pnpm run build:stage      # 预发布构建
pnpm run preview          # 预览构建产物
```

项目无测试框架、无 lint/format 配置。

## 路径别名

- `@` → `./src`
- `~` → 项目根目录

## 架构概览

### 技术栈

Vue 3 + Vite 5 + Element Plus（中文 locale）+ Pinia + Vue Router + Axios + ECharts + Sass

### 路由系统

- 静态路由：`src/router/index.js` 中的 `constantRoutes`（登录、404、首页等）
- 动态路由：后端通过 `getRouters()` API 返回菜单数据，由 `src/store/modules/permission.js` 转换为路由表，`router.addRoute()` 动态注册
- 路由守卫：`src/permission.js` 处理 token 校验、用户信息拉取、权限路由生成

### 状态管理（Pinia）

`src/store/modules/` 下 6 个 store：
- `user` — 认证 token、用户信息、角色/权限
- `permission` — 动态路由生成
- `app` — 侧边栏、设备类型
- `settings` — 主题、布局配置
- `tagsView` — 标签页导航
- `dict` — 字典数据缓存

### API 层

- 统一 axios 实例：`src/utils/request.js`，自动附带 Bearer token，拦截 401/500/601 错误
- API 模块按业务域组织在 `src/api/` 下（20+ 目录），标准模式：
  ```js
  export function listXxx(query) {
    return request({ url: '/xxx/list', method: 'get', params: query })
  }
  ```

### 页面与组件

- 业务页面：`src/views/`，30+ 目录覆盖碳报告、碳足迹、碳交易、采购、销售、仓储、MES 等
- 全局组件：`src/components/`（Pagination、FileUpload、ImageUpload、Editor、TreeSelect 等）
- 指令：`src/directive/`（`hasPermi` 权限、`hasRole` 角色、`copyText` 复制）
- 工具函数：`src/utils/`（`neu.js`/`neuedu.js` 含 parseTime、resetForm、handleTree、download 等）
- 全局插件：`src/plugins/`（modal 弹窗、download 下载、auth 鉴权、cache 缓存、tab 标签）

### 布局

`src/layout/index.vue` — Sidebar + Navbar + TagsView + AppMain + Settings 面板，响应式设计（<992px 自动折叠侧边栏）。

### 环境变量

- `.env.development` — 开发环境 API 前缀 `/dev-api`
- `.env.production` — 生产环境 API 前缀 `/prod-api`，开启 gzip
- `.env.staging` — 预发布环境 API 前缀 `/stage-api`，开启 gzip

## 代码风格

- Options API 和 Composition API（`<script setup>`）混合使用，新代码优先使用 `<script setup>`
- Element Plus 组件中文国际化
- 样式使用 Sass，部分使用 scoped style
- 图标使用 `vite-plugin-svg-icons`，SVG 文件放在 `src/assets/icons/`
