# 更新日志

## [0.6.2] - 2026-04-26

### 致命修复

- **上传截图后画廊不显示** — 截图上传/删除 API 缺失 `revalidatePath()`，ISR 缓存保留旧版 1 小时。现在上传/删除后立即刷新对应游戏详情页和列表页
- **纯中文游戏名创建后页面 404** — `slugify()` 正则 `\w` 只匹配 ASCII，中文全被删除产生空 slug → 链接失效。现在空结果时自动回退为 `game-{timestamp}` 格式 slug
- **新建游戏详情页不立即可用** — `POST /api/games` 遗漏 `revalidatePath('/games/' + slug)`，新游戏详情页需等到首次 ISR 过期后才可访问

### 新增

- **封面上传拖拽** — 封面图管理区域支持拖拽文件到预览区即可上传，拖入时青色边框高亮提示

### 变更

- **目录创建前置** — 创建游戏时 `mkdir` 移至数据库插入之前，失败时返回 500 不留下孤儿记录
- **dynamicParams 显式声明** — `/games/[slug]` 添加 `export const dynamicParams = true`

### 文件变更

| 文件 | 变更 |
|---|---|
| `src/lib/utils.ts` | 修改：slugify 空值回退 |
| `src/app/api/games/route.ts` | 修改：revalidate + mkdir 前置 |
| `src/app/api/games/[id]/screenshots/route.ts` | 修改：revalidatePath |
| `src/app/api/screenshots/[id]/route.ts` | 修改：revalidatePath + include slug |
| `src/app/games/[slug]/page.tsx` | 修改：dynamicParams |
| `src/app/admin/games/[id]/EditGameForm.tsx` | 修改：封面拖拽 |

---

## [0.6.1] - 2026-04-26

### 新增

- **拖拽上传** — 截图管理区域支持拖拽文件到区域即可上传，拖入时高亮蓝色虚线边框提示
- **截图预览** — 点击后台截图缩略图打开全屏预览，带关闭按钮
- **封面取色** — 上传封面图后自动提取图片主色调作为主题色（Canvas 10x10 采样 + 频次统计）
- **中文名优先** — 前厅卡片和游戏详情页优先展示中文名，英文名降为副标题

### 文件变更

| 文件 | 变更 |
|---|---|
| `src/app/admin/games/[id]/EditGameForm.tsx` | 修改：拖拽上传 + 预览 + 封面取色 |
| `src/components/GameCard.tsx` | 修改：中文名优先 |
| `src/app/games/[slug]/GameDetail.tsx` | 修改：中文名优先 |
| `src/app/admin/AdminDashboard.tsx` | 修改：中文名优先 |

---

## [0.6.0] - 2026-04-26

### 新增

- **AVIF/WebP 图片格式** — `next.config.ts` 配置 `formats: ['image/avif', 'image/webp']`，Next.js 自动生成现代格式副本，图片体积减少 50-70%
- **模糊占位符** — Gallery 截图和封面图添加 `placeholder="blur"` + 内联 `blurDataURL`，加载中显示浅灰模糊预览，感知性能大幅提升
- **前 3 张封面 priority** — GameCard 前 3 张（首屏可见）使用 `priority` + `fetchPriority="high"`，其余 lazy 加载防止首屏阻塞
- **Playfair Display 衬线字体** — 引入优雅的衬线展示字体用于首页标题、游戏详情标题、导航 Logo
- **首页纹理 + 浮动光点** — 英雄区添加 SVG fractalNoise 颗粒纹理和 3 个 `blur-3xl` 浮动渐变光点，营造暗室胶片质感
- **每游戏独立色彩** — 游戏详情页 Screenshots 计数器、悬停颜色跟随 `game.accentColor`，每个游戏拥有独特视觉身份

### 变更

- **导航栏精细化** — 圆角增至 `rounded-3xl`，边框透明度降低，背景更通透
- **Footer SVG 图标** — 社交链接从纯文字改为 SVG 图标（Twitter/Instagram/GitHub）
- **页面预取** — 游戏详情 Prev/Next 链接显式 `prefetch`

### 文件变更

| 文件 | 变更 |
|---|---|
| `next.config.ts` | 修改：添加 AVIF/WebP |
| `src/app/layout.tsx` | 修改：加载 Playfair Display |
| `src/app/globals.css` | 修改：注册 `--font-serif` 变量 |
| `src/components/HomeHero.tsx` | 修改：衬线标题 + 纹理 + 光点 |
| `src/components/ScreenshotGrid.tsx` | 修改：lazy + blurDataURL |
| `src/components/GameCard.tsx` | 修改：priority + lazy + blurDataURL |
| `src/components/Navbar.tsx` | 修改：视觉精细化 + 衬线 Logo |
| `src/components/Footer.tsx` | 修改：SVG 图标 |
| `src/app/games/[slug]/GameDetail.tsx` | 修改：衬线标题 + 色彩身份 + prefetch |
| `src/app/games/page.tsx` | 修改：衬线标题 |

---

## [0.5.1] - 2026-04-26

### 新增

- **重复图片检测** — 上传截图时计算 SHA-256 哈希与已有记录比对，相同图片自动跳过并提示「N 张重复跳过」

### 变更

- **无限滚动** — 游戏详情画廊从「加载更多」按钮改为 `IntersectionObserver` 自动触发，滚动接近底部（200px）时无声加载下一批
- **上传反馈优化** — 批量上传结果区分成功/重复/失败三类，中文提示清晰

### 文件变更

| 文件 | 变更 |
|---|---|
| `prisma/schema.prisma` | 修改：Screenshot 添加 `hash String?` |
| `src/app/api/games/[id]/screenshots/route.ts` | 修改：SHA-256 查重 + 写入 hash |
| `src/app/admin/games/[id]/EditGameForm.tsx` | 修改：409 重复跳过 + 三类反馈 |
| `src/components/ScreenshotGrid.tsx` | 修改：无限滚动替代按钮 |

---

## [0.5.0] - 2026-04-26

### 新增

- **分页加载** — 游戏详情画每次仅渲染 20 张截图，底部「加载更多照片」按钮逐步加载，避免大批量图片一次性渲染导致卡顿
- **ISR 增量静态再生** — 游戏详情页从纯 SSG 改为 ISR（1 小时间隔），新增/修改游戏后页面自动更新，无需重新构建
- **错误/加载/404 页面** — 新增全局 `error.tsx`、`loading.tsx`、`not-found.tsx`，提供友好的错误反馈和骨架屏加载
- **SEO 基础设施** — 新增 `robots.txt`、`sitemap.ts` 和增强的 Open Graph / Twitter Card metadata
- **50MB 上传限制** — 截图和封面图上传恢复文件大小上限（50MB）

### 修复

- **About 锚点** — 首页「了解更多」按钮 `href="#about"` 对应的 About 区域添加 `id="about"`，点击后正确滚动到 About 区域
- **Footer GitHub 链接** — 从占位 `https://github.com` 更新为 `https://github.com/M-1021/gameshot`

### 变更

- **图片响应式** — 所有 `<Image>` 组件添加 `sizes` 属性；`next.config.ts` 配置 `deviceSizes` + `imageSizes`，移动端不再加载桌面端大图
- **gitignore** — 排除 `public/images/games/`，防止用户上传的截图随 git 提交
- **种子数据迁移** — 种子占位图路径从 `/images/games/` 改为 `/images/placeholders/`
- **metadata 增强** — 根布局添加 `openGraph`、`twitter:card`、`keywords` 元信息

### 文件变更

| 文件 | 变更 |
|---|---|
| `src/app/page.tsx` | 修改：About 区域添加 `id="about"` |
| `src/components/Footer.tsx` | 修改：GitHub 链接 |
| `src/app/api/games/[id]/screenshots/route.ts` | 修改：添加 50MB 限制 |
| `src/app/api/upload/route.ts` | 修改：添加 50MB 限制 |
| `src/components/ScreenshotGrid.tsx` | 修改：分页加载 + `sizes` |
| `src/components/Lightbox.tsx` | 修改：添加 `sizes` |
| `src/components/GameCard.tsx` | 修改：添加 `sizes` |
| `next.config.ts` | 修改：deviceSizes + imageSizes |
| `src/app/games/[slug]/page.tsx` | 修改：添加 ISR revalidate |
| `src/app/api/games/route.ts` | 修改：POST 后 revalidatePath |
| `src/app/api/games/[id]/route.ts` | 修改：PUT/DELETE 后 revalidatePath |
| `.gitignore` | 修改：排除 `public/images/games/` |
| `prisma/seed.ts` | 修改：种子路径迁移 |
| `src/app/not-found.tsx` | 新增 |
| `src/app/error.tsx` | 新增 |
| `src/app/loading.tsx` | 新增 |
| `src/app/sitemap.ts` | 新增 |
| `public/robots.txt` | 新增 |
| `src/app/layout.tsx` | 修改：metadata 增强 |

---

## [0.4.0] - 2026-04-25

### 新增

- **批量上传截图** — 编辑页截图上传支持多选文件，逐个上传并汇总结果
- **记住我修复** — JWT cookie 添加 30 天持久化（`session.maxAge` + `cookies` 配置），关闭浏览器重开不再需要重复登录
- **修改密码** — 管理后台新增「修改密码」弹窗 + `PUT /api/admin/password` 端点
- **新建游戏宽松验证** — 仅需提供英文或中文名称之一即可创建，描述改为选填
- **Back to Games 导航修复** — `/games` 页面添加「返回首页」链接，解决从游戏详情返回后无法回到首页的问题

### 变更

- **截图展示 Masonry 瀑布流** — 前台画廊从 CSS grid 改为 `columns` 多列布局，每张截图保持原始宽高比，竖图/横图混排自然错落无黑边
- **后台缩略图自适应** — 管理后台截图缩略图使用 `object-contain` + 固定高度容器，完整显示图片无裁剪
- **解除 10MB 限制** — 截图上传和通用上传 API 移除文件大小限制
- **登录持久化** — NextAuth 配置添加 `30 天` JWT cookie 生命周期，配合 `auth_session` cookie 实现真正的「记住我」

### 文件变更

| 文件 | 变更 |
|---|---|
| `src/lib/auth.ts` | 修改：添加 session.maxAge + cookies.maxAge |
| `src/app/api/admin/password/route.ts` | 新增：密码修改 API |
| `src/app/admin/AdminDashboard.tsx` | 修改：添加修改密码弹窗 + 空 nameCn 后备 |
| `src/app/admin/games/new/page.tsx` | 修改：宽松名称验证 |
| `src/app/api/games/route.ts` | 修改：至少一名称为空检查 + slug 后备 |
| `src/app/admin/games/[id]/EditGameForm.tsx` | 修改：批量上传 + 自适应缩略图 |
| `src/app/api/games/[id]/screenshots/route.ts` | 修改：移除 10MB 限制 |
| `src/app/api/upload/route.ts` | 修改：移除 10MB 限制 |
| `src/components/ScreenshotGrid.tsx` | 修改：自适应宽高比 |
| `src/components/GameCard.tsx` | 修改：处理空 nameCn |
| `src/app/games/[slug]/GameDetail.tsx` | 修改：处理空 nameCn + 导航修复 |
| `src/app/games/page.tsx` | 修改：添加返回首页链接 |

---

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
