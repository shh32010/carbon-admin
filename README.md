# Carbon Admin — 双碳管理系统（前端）

基于 Vue 3 + Element Plus + Vite 构建的企业级碳排放管理平台，基于 [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue) 框架二次开发。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.3.9 | 前端框架 |
| Element Plus | 2.7.3 | UI 组件库（中文 locale） |
| Vite | 5.0.4 | 构建工具 |
| Vue Router | 4.2.5 | 路由（动态菜单 + 权限控制） |
| Pinia | 2.1.7 | 状态管理 |
| Axios | 0.27.2 | HTTP 请求 |
| ECharts | 5.4.3 | 数据可视化 |
| Sass | 1.69.5 | CSS 预处理器 |
| diagram-js | 14.3.1 | 流程图绘制 |

## 功能模块

- **碳管理核心** — 碳排放报告、碳足迹核算、碳配额交易竞价
- **供应链** — 采购、销售、仓储、物流运输、物料管理
- **生产制造（MES）** — 生产计划、工艺模型、质检、生产执行
- **系统管理** — 用户/角色/权限（RBAC）、系统监控、CMS、数据仪表盘

## 快速开始

```bash
# 环境要求：Node.js >= 16，pnpm

pnpm install                    # 安装依赖
pnpm run dev                    # 启动开发服务器（端口 80）
pnpm run build:prod             # 生产构建
pnpm run build:stage            # 预发布构建
pnpm run preview                # 预览构建产物
```

开发环境 API 代理 `/dev-api` → `localhost:9090`（后端服务），配置见 `vite.config.js`。

## 项目结构

```
src/
├── api/                # 接口模块（20+ 业务域）
├── assets/             # 静态资源、样式
├── components/         # 全局组件（Pagination、FileUpload、Editor 等）
├── directive/          # 自定义指令（hasPermi、hasRole、copyText）
├── layout/             # 布局（Sidebar + Navbar + TagsView + AppMain）
├── plugins/            # 全局插件（modal、download、auth、cache）
├── router/             # 路由定义（静态 + 动态权限路由）
├── store/              # Pinia 状态管理（user、permission、app 等 6 个模块）
├── utils/              # 工具函数（request、auth、validate 等）
├── views/              # 业务页面（30+ 目录）
├── permission.js       # 路由守卫
├── settings.js         # 全局设置
└── main.js             # 入口文件
```

## 架构要点

- **路由**：后端 `getRouters()` 返回菜单数据 → Pinia `permission` store 转换为路由表 → `router.addRoute()` 动态注册
- **权限**：`src/permission.js` 路由守卫校验 token，`hasPermi` / `hasRole` 指令控制按钮级权限
- **API**：统一 axios 实例（`src/utils/request.js`），自动携带 Bearer token，拦截 401 跳转登录
- **环境**：`.env.development` / `.env.production` / `.env.staging` 三套环境配置
- **全局配置**：`src/settings.js` 控制主题色、布局、系统标题等

## 许可证

[MIT](LICENSE)
