# 更新日志

## [0.3.0] - 2026-04-25

### 新增：封面图管理

- **编辑页新增封面图区域** — 在 `/admin/games/[id]` 编辑页顶部新增「封面图」管理模块，支持上传和移除封面
- **前台卡片展示封面** — `GameCard` 组件优先展示 `coverImage`（带 `object-cover` 和悬停缩放），无封面时仍显示主题色首字母占位
- **API 支持** — `PUT /api/games/[id]` 增加 `coverImage` 字段读写

### 新增：登录会话控制（记住我）

- **记住我功能** — 登录页新增「记住我」复选框（默认勾选）：勾选时 `auth_session` cookie 持续 30 天，不勾选时关闭浏览器即失效
- **强制重登机制** — `proxy.ts` 增加 `auth_session` cookie 校验，JWT 有效但会话标记丢失时重定向到登录页
- **退出登录** — 管理后台新增「退出登录」按钮，同时清除 `auth_session` cookie 和 JWT

### 修复

- **认证绕过** — 将 `middleware.ts` 的 `auth()` 包装器改为 `getToken()` 手动读取 JWT
- **Hydration 不匹配** — `ThemeProvider` useState 固定初始化为 "dark"，hydration 完成后通过 useEffect 从 localStorage 恢复真实主题
- **middleware 弃用警告** — 将 `src/middleware.ts` 迁移为 `src/proxy.ts`，函数名从 `middleware` 改为 `proxy`

### 文件变更

| 文件 | 变更 |
|---|---|
| `src/proxy.ts` | 新增（替代 middleware） |
| `src/middleware.ts` | 删除 |
| `src/components/ThemeProvider.tsx` | 修改：修复 hydration 不匹配 |
| `src/app/admin/login/page.tsx` | 修改：添加记住我 + auth_session |
| `src/app/admin/AdminDashboard.tsx` | 修改：添加退出登录按钮 |
| `src/app/admin/games/[id]/EditGameForm.tsx` | 修改：添加封面图管理 |
| `src/app/api/games/[id]/route.ts` | 修改：PUT 支持 coverImage |
| `src/components/GameCard.tsx` | 修改：支持封面图展示 |
| `src/app/page.tsx` | 修改：传递 coverImage |
| `src/app/games/page.tsx` | 修改：传递 coverImage |
| `.env` | 修改：添加 AUTH_SECRET |

---

## [0.2.0] - 2026-04-25

### 新增：管理后台

- **数据库** — 引入 Prisma 7 + SQLite，定义 Admin / Game / Screenshot 三个模型
- **身份认证** — 接入 NextAuth v5 Credentials 提供者，单管理员账号登录
- **管理后台页面**
  - `/admin/login` — 管理员登录页
  - `/admin` — 仪表盘：游戏列表（新建 / 编辑 / 删除）
  - `/admin/games/new` — 新建游戏表单（名称、简介、主题色）
  - `/admin/games/[id]` — 编辑游戏信息 + 截图上传/删除
- **API 路由**
  - `POST /api/auth/[...nextauth]` — 登录/登出
  - `GET/POST /api/games` — 游戏列表 / 新建
  - `GET/PUT/DELETE /api/games/[id]` — 详情 / 编辑 / 删除
  - `POST /api/games/[id]/screenshots` — 上传截图
  - `DELETE /api/screenshots/[id]` — 删除截图
  - `POST /api/upload` — 通用图片上传
- **种子数据** — 管理员账号（admin / admin123）+ 3 个游戏（15 张截图）
- **路由保护** — middleware 拦截 `/admin/*`，未登录重定向

### 重构：B 端数据源

- 首页、游戏列表、游戏详情页从 `games.ts` 静态数据改为 Prisma 数据库查询
- 删除 `src/data/games.ts`

### 文件变更

| 文件 | 变更 |
|---|---|
| `prisma/schema.prisma` | 新增 |
| `prisma/seed.ts` | 新增 |
| `prisma.config.ts` | 新增 |
| `src/lib/auth.ts` | 新增 |
| `src/lib/prisma.ts` | 新增 |
| `src/middleware.ts` | 新增（后迁移为 proxy.ts） |
| `src/app/admin/login/page.tsx` | 新增 |
| `src/app/admin/page.tsx` | 新增 |
| `src/app/admin/AdminDashboard.tsx` | 新增 |
| `src/app/admin/layout.tsx` | 新增 |
| `src/app/admin/games/new/page.tsx` | 新增 |
| `src/app/admin/games/[id]/page.tsx` | 新增 |
| `src/app/admin/games/[id]/EditGameForm.tsx` | 新增 |
| `src/app/api/auth/[...nextauth]/route.ts` | 新增 |
| `src/app/api/games/route.ts` | 新增 |
| `src/app/api/games/[id]/route.ts` | 新增 |
| `src/app/api/games/[id]/screenshots/route.ts` | 新增 |
| `src/app/api/screenshots/[id]/route.ts` | 新增 |
| `src/app/api/upload/route.ts` | 新增 |
| `src/app/api/games/[id]/screenshots/route.ts` | 新增 |
| `src/data/games.ts` | 删除 |
| `package.json` | 修改：添加 prisma 脚本 |
| `.env` | 修改：添加 DATABASE_URL |
| README.md | 修改：完整重写 |

---

## [0.1.0] - 2026-04-25

### 初始版本

- 基于 Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion 搭建
- 三页面结构：首页（英雄区 + 精选 + 关于）、游戏列表（`/games`）、游戏详情（`/games/[slug]`）
- **深色/浅色主题** — 跟随系统偏好 + 手动切换 + localStorage 持久化
- **滚动动画** — ScrollReveal 组件（IntersectionObserver + Framer Motion），首页视差背景
- **灯箱浏览** — 点击截图展开大图，键盘左右切换，Esc 关闭
- **响应式布局** — 桌面 3 列 / 平板 2 列 / 移动端 1 列
- **毛玻璃导航** — 固定顶部导航栏 + backdrop-blur 效果
- **全静态生成 (SSG)** — 所有页面预渲染
- 3 个示例游戏：Cyberpunk 2077 / Elden Ring / Ghost of Tsushima

### 文件结构

```
src/
├── app/                   # Next.js App Router 页面
│   ├── globals.css        # 全局样式 + 主题变量
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── games/             # 游戏相关页面
├── components/            # UI 组件
│   ├── Navbar.tsx         # 导航栏
│   ├── Footer.tsx         # 页脚
│   ├── HomeHero.tsx       # 首页英雄区
│   ├── GameCard.tsx       # 游戏卡片
│   ├── ScreenshotGrid.tsx # 截图网格
│   ├── Lightbox.tsx       # 灯箱组件
│   ├── ScrollReveal.tsx   # 滚动动画
│   ├── ThemeProvider.tsx  # 主题上下文
│   └── ThemeToggle.tsx    # 主题切换
├── data/games.ts          # 游戏数据（v0.2.0 移除）
└── lib/types.ts           # 类型定义
```
