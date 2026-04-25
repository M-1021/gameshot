# GameShot - 游戏摄影作品集

一个使用 **Next.js 16** 构建的个人游戏摄影/截图展示网站，配备管理后台，设计风格现代且富有艺术感。

## 技术栈

| 技术 | 用途 |
|---|---|
| Next.js 16 (App Router) | 框架 |
| TypeScript | 类型安全 |
| Tailwind CSS v4 | 样式 |
| Framer Motion | 滚动动画 |
| Prisma 7 + SQLite | 数据库 ORM |
| NextAuth v5 | 身份认证 |

## 功能特性

### 前台（B 端）

- **响应式布局** — 桌面 3 列 / 平板 2 列 / 移动端 1 列
- **深色/浅色主题** — 跟随系统偏好，支持手动切换并持久化
- **滚动动画** — 元素进入视口时淡入升起，首页视差背景
- **灯箱浏览** — 点击截图展开大图，键盘左右切换，Esc 关闭
- **静态生成 (SSG)** — 所有页面预渲染，加载极速

### 管理后台

- **管理员登录** — 单账号密码认证，Session 持久化
- **游戏管理** — 新建 / 编辑 / 删除游戏分类
- **截图管理** — 上传 / 删除截图，支持 jpg/png/webp/svg
- **主题色配置** — 每个游戏可自定义标识颜色

## 页面结构

```
/                       → 首页（英雄区 + 精选作品 + 关于）
/games                  → 游戏分类列表
/games/[slug]           → 游戏详情 + 截图画廊
/admin/login            → 管理员登录
/admin                  → 管理后台首页（游戏列表）
/admin/games/new        → 新建游戏
/admin/games/[id]       → 编辑游戏 + 管理截图
```

## 项目结构

```
gameshot/
├── prisma/
│   ├── schema.prisma        # 数据库模型定义
│   ├── seed.ts              # 种子脚本（初始化数据）
│   └── dev.db               # SQLite 数据库文件
│
├── src/
│   ├── app/
│   │   ├── page.tsx         # 首页（服务端组件）
│   │   ├── games/...        # 前台游戏相关页面
│   │   ├── admin/...        # 管理后台页面
│   │   └── api/...          # API 路由
│   │
│   ├── components/          # UI 组件
│   ├── lib/
│   │   ├── auth.ts          # NextAuth 配置
│   │   ├── prisma.ts        # Prisma 客户端单例
│   │   └── types.ts         # 类型定义
│   │
│   └── middleware.ts        # 路由保护中间件
│
├── public/images/games/     # 游戏图片存放目录
├── .env                     # 环境变量
└── prisma.config.ts         # Prisma 配置
```

## 快速开始

```bash
# 安装依赖
npm install

# 生成 Prisma 客户端 + 创建数据库
npm run db:push

# 导入示例数据（管理员 + 3 个游戏）
npm run db:seed

# 启动开发服务器
npm run dev
```

打开 **http://localhost:3000** 浏览前台。

## 管理后台使用教程

### 登录

1. 访问 **http://localhost:3000/admin/login**
2. 输入默认账号密码：
   - 用户名：`admin`
   - 密码：`admin123`
3. 登录后进入管理首页

### 管理游戏

管理首页展示所有游戏列表，每行显示游戏名称、中文名、截图数量：

- **预览** — 点击跳转到前台该游戏详情页
- **编辑** — 进入游戏编辑页面，可修改名称、简介、主题色
- **删除** — 删除该游戏及其所有截图（不可恢复）

### 新建游戏

1. 点击管理首页右上角「+ 新建游戏」
2. 填写：
   - 游戏名称（英文）- 自动生成 URL slug
   - 游戏名称（中文）
   - 游戏简介（可选）
   - 主题色（选择器）
3. 点击「创建游戏」→ 自动跳转到编辑页

### 管理截图

在游戏编辑页的「截图管理」区域：

- **上传** — 点击「+ 上传截图」选择文件（支持 jpg/png/webp/svg，最大 10MB）
- **删除** — 将鼠标悬停在截图上，点击右上角的 X 按钮

### 修改密码

目前需通过数据库直接修改，后续版本会添加密码修改功能。

## 数据库命令

```bash
npm run db:push        # 将 schema 同步到数据库
npm run db:seed        # 导入示例数据
npm run db:studio      # 打开 Prisma Studio 可视化数据库
npm run db:reset       # 重置数据库 + 重新导入数据
```

## 部署注意事项

1. 生产环境需设置 `DATABASE_URL` 环境变量
2. SQLite 文件数据库不适合多实例部署，如需多实例请切换到 PostgreSQL
3. 图片上传目录 (`public/images/games/`) 需有写入权限

## 许可

MIT
