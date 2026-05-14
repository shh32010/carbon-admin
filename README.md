# 双碳管理系统（前端）

基于 Vue 3 + Element Plus + Vite 构建的双碳管理平台前端项目，基于 [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue) 框架二次开发。

## 项目简介

本系统是面向碳排放管理领域的综合业务平台，涵盖碳排放报告、碳足迹核算、碳交易竞价、采购销售管理、仓储物流、生产制造（MES）等核心业务模块，为企业提供完整的碳管理数字化解决方案。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.3.9 | 前端框架 |
| Element Plus | 2.7.3 | UI 组件库 |
| Vite | 5.0.4 | 构建工具 |
| Vue Router | 4.2.5 | 路由管理 |
| Pinia | 2.1.7 | 状态管理 |
| Axios | 0.27.2 | HTTP 请求 |
| ECharts | 5.4.3 | 数据可视化 |
| Sass | 1.69.5 | CSS 预处理器 |
| Vue Quill | 1.2.0 | 富文本编辑器 |
| diagram-js | 14.3.1 | 流程图/图表绘制 |

## 项目结构

```
carbon-admin/
├── public/                  # 静态资源
├── src/
│   ├── api/                 # 接口请求模块
│   │   ├── adv/             # 广告管理
│   │   ├── baseInfo/        # 基础信息
│   │   ├── bid/             # 竞价管理
│   │   ├── carbonReport/    # 碳排放报告
│   │   ├── cfConfig/        # 碳足迹配置
│   │   ├── cfElectric/      # 碳足迹电力
│   │   ├── cms/             # 内容管理
│   │   ├── distribusion/    # 配送管理
│   │   ├── material/        # 物料管理
│   │   ├── mesCheck/        # 质检管理
│   │   ├── mesModel/        # 生产模型
│   │   ├── mesPlan/         # 生产计划
│   │   ├── mesProduct/      # 生产管理
│   │   ├── monitor/         # 系统监控
│   │   ├── purchase/        # 采购管理
│   │   ├── purchaseReport/  # 采购报表
│   │   ├── query/           # 查询工具
│   │   ├── sale/            # 销售管理
│   │   ├── saleReport/      # 销售报表
│   │   ├── system/          # 系统管理
│   │   ├── tool/            # 系统工具
│   │   ├── transportApply/  # 运输申请
│   │   ├── warehouse/       # 仓储管理
│   │   ├── wmsApply/        # 仓储申请
│   │   └── wmsReport/       # 仓储报表
│   ├── assets/              # 静态资源（图片、样式等）
│   ├── components/          # 公共组件
│   ├── directive/           # 自定义指令
│   ├── layout/              # 页面布局
│   ├── plugins/             # 插件
│   ├── router/              # 路由配置
│   ├── store/               # Pinia 状态管理
│   ├── utils/               # 工具函数
│   ├── views/               # 页面视图
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   ├── permission.js        # 路由权限控制
│   └── settings.js          # 全局配置
├── vite.config.js           # Vite 配置
├── package.json             # 项目依赖
└── pnpm-lock.yaml           # pnpm 锁定文件
```

## 功能特性

### 碳管理核心
- **碳排放报告** — 碳排放数据的录入、统计与报告生成
- **碳足迹核算** — 碳足迹配置与电力碳排放计算
- **碳交易竞价** — 碳配额竞价交易管理

### 业务管理
- **采购管理** — 采购订单、采购报表
- **销售管理** — 销售订单、销售报表
- **仓储管理** — 库存管理、仓储申请、仓储报表
- **物流运输** — 运输申请与配送管理
- **物料管理** — 物料基础信息维护

### 生产制造（MES）
- **生产计划** — 生产排程与计划管理
- **生产模型** — 生产工艺模型配置
- **质检管理** — 产品质量检验流程
- **生产执行** — 生产过程跟踪管理

### 系统管理
- **用户/角色/权限** — 基于 RBAC 的权限控制
- **系统监控** — 在线用户、服务监控
- **内容管理** — CMS 内容发布
- **数据可视化** — 仪表盘与 ECharts 图表

## 安装部署

### 环境要求

- **Node.js** >= 16
- **pnpm**（推荐）

### 安装步骤

```bash
# 1. 安装 pnpm
npm i pnpm -g

# 2. 配置淘宝镜像源（可选，加速依赖安装）
pnpm config set registry https://registry.npmmirror.com/

# 3. 安装依赖
pnpm i

# 4. 启动开发服务器
pnpm run dev

# 5. 生产环境打包
pnpm run build:prod

# 6. 预览打包结果
pnpm run preview
```

## 配置说明

### 环境变量

项目支持多环境配置，通过 Vite 模式区分：

- `pnpm run dev` — 开发环境
- `pnpm run build:prod` — 生产环境
- `pnpm run build:stage` — 测试环境

### 全局配置

编辑 `src/settings.js` 可修改系统标题、主题色、布局等全局设置。

### API 代理

开发环境的 API 代理配置位于 `vite.config.js`，可修改后端接口地址。

## 许可证

[MIT](LICENSE)
