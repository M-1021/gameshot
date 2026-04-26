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

### 前台

- **响应式布局** — 桌面 3 列 / 平板 2 列 / 移动端 1 列
- **深色/浅色主题** — 支持手动切换，偏好持久化
- **Masonry 瀑布流画廊** — 横竖图自然排布，保持原始宽高比
- **无限滚动** — 滚动到底部自动加载更多，无割裂体验
- **灯箱浏览** — 点击截图全屏查看，键盘左右切换，Esc 关闭
- **模糊占位符** — 图片加载中显示占位预览，无白屏闪烁
- **衬线字体设计** — Playfair Display 展示字体 + 首页颗粒纹理氛围
- **ISR 增量再生** — 游戏详情页 1 小时间隔自动更新

### 管理后台

- **管理员登录** — 单账号密码认证，记住我 + 30 天持久化
- **修改密码** — 仪表盘内弹窗修改密码
- **游戏管理** — 新建 / 编辑 / 删除游戏，主题色自动从封面提取
- **截图管理** — 上传 / 删除 / 预览截图，支持 jpg/png/webp/svg（最大 50MB）
- **拖拽上传** — 截图区域和封面区域均可拖拽文件上传
- **批量上传** — 一次选择多张截图，逐个上传并汇总结果
- **重复检测** — SHA-256 比对自动跳过已存在的图片
- **主题色配置** — 每个游戏可自定义标识颜色，上传封面后自动取色

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

## 分享网站给朋友

### 快速分享（serveo — 无需注册、无需公网 IP）

适用于给朋友临时预览网站，一键生成公网链接。

```bash
# 1. 构建生产版本并启动
npm run build
npm start

# 2. 另开一个终端，启动 serveo 隧道
ssh -R 80:localhost:3000 serveo.net
# 输出：Forwarding HTTP traffic from https://xxxx.serveousercontent.com
```

将终端输出的 `https://xxxx.serveousercontent.com` 发给朋友即可。

**自定义域名（可选）：**
```bash
ssh -R myname:80:localhost:3000 serveo.net
# → https://myname.serveo.net
```

### 长期分享（Cloudflare Tunnel — 免费、CDN 缓存）

适合长期让朋友访问，图片会被 Cloudflare CDN 自动缓存加速。

```bash
# 安装
winget install Cloudflare.cloudflared

# 启动临时隧道（一键获取链接）
cloudflared tunnel --url http://localhost:3000
# 输出：https://xxxx.trycloudflare.com
```

### 正式部署（VPS 自托管）

详见下方「部署」章节。

---

## 项目结构

```
gameshot/
├── prisma/
│   ├── schema.prisma        # 数据库模型定义
│   ├── seed.ts              # 种子脚本（初始化数据）
│   └── dev.db               # SQLite 数据库文件（gitignore）
│
├── src/
│   ├── app/
│   │   ├── layout.tsx       # 根布局（ThemeProvider + Navbar + Footer）
│   │   ├── page.tsx         # 首页
│   │   ├── globals.css      # 全局样式
│   │   ├── sitemap.ts       # 自动生成 sitemap.xml
│   │   ├── error.tsx        # 全局错误边界
│   │   ├── loading.tsx      # 全局加载骨架
│   │   ├── not-found.tsx    # 自定义 404 页面
│   │   ├── games/           # 前台游戏页面
│   │   ├── admin/           # 管理后台页面
│   │   └── api/             # API 路由
│   │
│   ├── components/          # UI 组件
│   ├── lib/
│   │   ├── auth.ts          # NextAuth 配置
│   │   ├── prisma.ts        # Prisma 客户端
│   │   ├── types.ts         # 类型定义
│   │   └── utils.ts         # 工具函数
│   │
│   └── proxy.ts             # 路由保护（校验 JWT + auth_session）
│
├── public/
│   ├── images/
│   │   ├── games/           # 用户上传截图（gitignore）
│   │   ├── uploads/         # 用户上传封面（gitignore）
│   │   └── placeholders/    # 种子占位图
│   └── robots.txt           # 搜索引擎爬虫规则
│
├── .env                     # 环境变量
├── opencode.json            # OpenCode 超级能力插件配置
├── next.config.ts           # Next.js 配置（图片优化等）
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

在游戏编辑页的「截图管理」区域，支持点击-拖拽和拖拽上传两种方式：

- **上传** — 点击「+ 上传截图」选择文件（支持多选），或直接将文件拖入截图区域
- **预览** — 点击缩略图放大查看
- **删除** — 悬停在截图上，点击右上角的 X 按钮
- **重复跳过** — 上传相同图片时自动检测并跳过，结果提示「N 张重复跳过」
- 支持 jpg/png/webp/svg，最大 50MB

### 上传封面图

在游戏编辑页的「封面图」区域：

- **上传** — 点击「上传封面」或直接拖拽图片到封面区域
- **自动取色** — 上传封面后自动提取主色调填入主题色
- **移除** — 点击「移除封面」恢复默认
- 封面图前台展示在游戏卡片中；无封面时显示主题色 + 首字母占位

### 修改密码

在管理首页右上角点击「修改密码」→ 输入当前密码和新密码 → 确认修改。

## 数据库命令

```bash
npm run db:push        # 将 schema 同步到数据库
npm run db:seed        # 导入示例数据
npm run db:studio      # 打开 Prisma Studio 可视化数据库
npm run db:reset       # 重置数据库 + 重新导入数据
```

## 部署

### 开发环境

```bash
# 启动开发服务器（热更新）
npm run dev
# → http://localhost:3000
```

### 生产构建

```bash
# 构建 + 启动生产服务器
npm run build
npm start
# → http://localhost:3000 （性能优于 dev 模式，serveo 等隧道必须用此模式）
```

### 自托管（Nginx + PM2）

```bash
# 1. 构建项目
npm run build

# 2. 使用 PM2 启动
pm2 start npm --name gameshot -- start
pm2 save

# 3. Nginx 反向代理 + 静态文件直连
```

**Nginx 配置示例：**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    # 静态图片绕过 Node.js，直接 Nginx 返回
    location /images/ {
        alias /path/to/gameshot/public/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 环境变量

```bash
# .env（本地开发，不会提交到 git）
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-random-secret"          # openssl rand -hex 32 生成
SITE_URL="http://localhost:3000"          # 用于 sitemap 生成
```

### 注意事项

1. SQLite 文件数据库不适合多实例部署，多实例请切换 PostgreSQL
2. 图片上传目录 (`public/images/games/` 和 `public/images/uploads/`) 已加入 `.gitignore`，不会随代码提交
3. 首次部署需 `npm run db:push && npm run db:seed` 初始化数据库
4. 生产环境务必修改默认管理员密码（admin / admin123）

## 许可

MIT
