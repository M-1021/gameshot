<!-- BEGIN:nextjs-agent-rules -->
# 注意：这不是你熟知的 Next.js

当前版本存在破坏性变更——API、约定和文件结构可能与训练数据不同。在编写代码前，请先阅读 `node_modules/next/dist/docs/` 中的相关指南。关键变更已在下文标注。

## Next.js 16 关键变更

- `middleware.ts` 已弃用，改为 `proxy.ts`（导出 `proxy` 函数而非 `middleware`）
- Prisma 7 不再支持 schema 中的 `url` 属性，需通过 `@prisma/adapter-libsql` 适配器连接 SQLite
- `next-auth` v5 beta，使用 `import { auth } from "@/lib/auth"` 而非旧版 `getServerSession`
- 路由保护使用 `getToken()` 从 `next-auth/jwt` 手动读取 JWT，而非 `auth()` 包装器
<!-- END:nextjs-agent-rules -->

# GameShot — 完整项目手册

## 项目概览

个人游戏摄影/截图作品集网站。前台展示精美截图，后台管理游戏和图片资源。

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4（`@tailwindcss/postcss`，class-based dark mode via `@custom-variant dark`）
- **动画**: Framer Motion
- **数据库**: SQLite + Prisma 7 + `@prisma/adapter-libsql`
- **认证**: NextAuth v5 (beta) + Credentials + JWT
- **图片**: 本地文件系统，上传到 `public/images/games/`

## 目录结构

```
gameshot/
├── prisma/
│   ├── schema.prisma        # 数据库模型：Admin / Game / Screenshot
│   ├── seed.ts              # 种子脚本（管理员 + 3 个示例游戏）
│   └── dev.db               # SQLite 数据库文件（gitignore）
├── src/
│   ├── proxy.ts             # 路由保护：校验 JWT + auth_session cookie
│   ├── lib/
│   │   ├── auth.ts          # NextAuth 配置（Credentials 单账号）
│   │   ├── prisma.ts        # Prisma 客户端单例（libsql 适配器）
│   │   └── types.ts         # 类型定义（Screenshot / Game）
│   ├── components/          # UI 组件（13 个）
│   ├── app/
│   │   ├── layout.tsx       # 根布局（ThemeProvider + Navbar + Footer）
│   │   ├── page.tsx         # 首页：英雄区 + 游戏卡片列表
│   │   ├── games/           # 前台页面
│   │   ├── admin/           # 管理后台（5 个页面）
│   │   └── api/             # API 路由（7 个端点）
│   └── ...
├── public/images/games/     # 游戏图片（封面 + 截图）
├── .env                     # DATABASE_URL + AUTH_SECRET
├── prisma.config.ts         # Prisma 配置
├── CHANGELOG.md             # 所有变更记录
└── README.md                # 详细文档 + 管理后台使用教程
```

## 数据库模型

```prisma
model Admin       { id, username (unique), passwordHash }
model Game        { id, slug (unique), name, nameCn, description, coverImage?, accentColor, screenshots[] }
model Screenshot  { id, gameId (FK->Game), src, alt, width, height, sortOrder }
```

## 路由表

| 路径 | 类型 | 说明 |
|---|---|---|
| `/` | SSR → 静态 | 首页 |
| `/games` | SSR → 静态 | 游戏列表 |
| `/games/[slug]` | ISR (1h) | 游戏详情 + 截图画廊（分页加载，每页 20 张） |
| `/admin/login` | 静态 | 管理员登录（记住我支持） |
| `/admin` | SSR | 管理仪表盘（游戏列表） |
| `/admin/games/new` | 静态 | 新建游戏 |
| `/admin/games/[id]` | SSR | 编辑游戏 + 截图管理 + 封面上传 |
| `/api/auth/[...nextauth]` | 动态 | NextAuth 认证 |
| `/api/games` | 动态 | 游戏 CRUD |
| `/api/games/[id]` | 动态 | 单游戏 CRUD |
| `/api/games/[id]/screenshots` | 动态 | 截图上传/列表 |
| `/api/screenshots/[id]` | 动态 | 删除截图 |
| `/api/upload` | 动态 | 通用图片上传 |

## 认证机制

1. **登录**: `POST /api/auth/callback/credentials` → 返回 JWT cookie
2. **会话标记**: 登录成功时设置 `auth_session` cookie（30 天或会话级，取决于"记住我"）
3. **Proxy 校验** (`src/proxy.ts`): 每个 `/admin/*` 请求检查 JWT + `auth_session`，任一缺失则重定向到登录
4. **退出登录**: 清除 `auth_session` cookie + `signOut()`

## 数据流

```
前台：Server Component → prisma.findMany() → 客户端组件 props
后台：Client Component → fetch("/api/games/...") → API Route → prisma
图片上传：Client → FormData → /api/upload → public/images/games/ → 记录路径到 DB
```

## 关键实现细节

### 主题切换（`ThemeProvider`）
- `useState<Theme>("dark")` 初始化为 "dark"，保证 SSR 和首次 hydration 一致
- `useEffect` 在 hydration 后从 localStorage 恢复真实偏好
- 使用 `@custom-variant dark (&:where(.dark, .dark *))` 实现 class-based dark mode

### 前端组件数据流
- `page.tsx`（Server Component）调用 `prisma` 获取数据
- 数据映射为简单对象后传给 Client Component
- `GameCard` 属性：`{ slug, name, nameCn, accentColor, coverImage?, screenshotCount? }`
- `GameDetail` 属性：`{ game: Game, prev: {slug,name}?, next: {slug,name}? }`
- `ScreenshotGrid` 分页加载：默认显示 20 张，点击「加载更多」每次追加 20 张

### Prisma 7 注意
- Schema 中不可使用 `url` 属性
- Client 初始化需传入 `@prisma/adapter-libsql` 适配器
- `datasourceUrl` 属性不存在，使用 `adapter` 选项代替

### ISR 与缓存更新
- `/games/[slug]` 页面使用 ISR（`revalidate = 3600`，1 小时后再验证）
- API 中创建/更新/删除游戏后调用 `revalidatePath()` 主动刷新静态页面

### 图片存储与 gitignore
- 用户上传的截图和封面图存于 `public/images/games/`，此目录已加入 `.gitignore`
- 种子数据的占位图路径为 `public/images/placeholders/`（git 跟踪）

### 管理后台截图上传
- 限制 10MB，支持 jpg/png/webp/svg
- 文件名格式：`shot-{timestamp}.{ext}`
- 保存在 `public/images/games/{slug}/` 目录
- 上传后 `router.refresh()` 刷新页面数据
- 删除时同时删除数据库记录和物理文件

### 封面图管理
- 上传到 `/api/upload`，返回 `{ src }` 路径
- 通过 `PUT /api/games/[id]` 将 `coverImage` 写入数据库
- 前台 `GameCard` 有封面图则显示图片，否则显示主题色首字母占位

## 常用命令

```bash
npm run dev          # 开发服务器（localhost:3000）
npm run build        # Prisma generate + db push + Next build
npm run lint         # ESLint
npm run db:seed      # 导入示例数据（管理员 + 3 游戏）
npm run db:push      # 同步 Prisma schema 到数据库
npm run db:studio    # Prisma Studio（可视化数据库）
npm run db:reset     # 重置数据库 + 重新 seed
```

## 当前已知问题

- 种子占位图路径在 `public/images/placeholders/` 下，但实际占位 SVG 文件未提交到仓库（`public/images/games/` 已在 gitignore 排除）
- 删除游戏时不会自动删除封面文件（手动清理）
