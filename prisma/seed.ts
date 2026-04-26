/**
 * 数据库种子脚本
 * 首次运行项目时执行，用于：
 * 1. 创建默认管理员账号
 * 2. 导入示例游戏数据
 */

import { resolve } from "path"
import { readFileSync } from "fs"

// 手动解析 .env 文件
const envPath = resolve(__dirname, "..", ".env")
const envContent = readFileSync(envPath, "utf-8")
for (const line of envContent.split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const [key, ...rest] = trimmed.split("=")
  if (key && !process.env[key.trim()]) {
    process.env[key.trim()] = rest.join("=").replace(/^"|"$/g, "").trim()
  }
}

import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import bcrypt from "bcryptjs"

const dbUrl = `file:${resolve(__dirname, "..", "dev.db")}`
const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: dbUrl }) })

const COLORS = {
  cyberpunk: "#00e5ff",
  elden: "#ffd700",
  ghost: "#ff4455",
} as const

const GAMES_DATA = [
  {
    slug: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    nameCn: "赛博朋克 2077",
    description:
      "Night City 的光影交错中，每一帧都是未来主义的视觉盛宴。从霓虹闪烁的街道到荒坂大厦的顶层，记录这座不夜城的每一个角落。",
    accentColor: COLORS.cyberpunk,
    screenshots: [
      { src: "/images/placeholders/cyberpunk2077/shot-01.svg", alt: "夜之城街头" },
      { src: "/images/placeholders/cyberpunk2077/shot-02.svg", alt: "霓虹雨夜" },
      { src: "/images/placeholders/cyberpunk2077/shot-03.svg", alt: "荒坂大厦" },
      { src: "/images/placeholders/cyberpunk2077/shot-04.svg", alt: "日落余晖" },
      { src: "/images/placeholders/cyberpunk2077/shot-05.svg", alt: "雨中倒影" },
      { src: "/images/placeholders/cyberpunk2077/shot-06.svg", alt: "街头赛车" },
    ],
  },
  {
    slug: "elden-ring",
    name: "Elden Ring",
    nameCn: "艾尔登法环",
    description:
      "交界地的壮丽史诗，以镜头捕捉黄金树下的每一寸土地。从宁姆格福到王城罗德尔，记录褪色者的奇幻旅程。",
    accentColor: COLORS.elden,
    screenshots: [
      { src: "/images/placeholders/elden-ring/shot-01.svg", alt: "黄金树下的骑士" },
      { src: "/images/placeholders/elden-ring/shot-02.svg", alt: "永恒之城" },
      { src: "/images/placeholders/elden-ring/shot-03.svg", alt: "湖之利耶尼亚" },
      { src: "/images/placeholders/elden-ring/shot-04.svg", alt: "巨龙之战" },
    ],
  },
  {
    slug: "ghost-of-tsushima",
    name: "Ghost of Tsushima",
    nameCn: "对马岛之魂",
    description:
      "对马岛的风与诗，每一片落叶都是和风的笔触。用武士的视角捕捉战火中的自然之美，让每一张截图都成为一幅浮世绘。",
    accentColor: COLORS.ghost,
    screenshots: [
      { src: "/images/placeholders/ghost-of-tsushima/shot-01.svg", alt: "紫竹林" },
      { src: "/images/placeholders/ghost-of-tsushima/shot-02.svg", alt: "落日神社" },
      { src: "/images/placeholders/ghost-of-tsushima/shot-03.svg", alt: "雪中决斗" },
      { src: "/images/placeholders/ghost-of-tsushima/shot-04.svg", alt: "红叶隧道" },
      { src: "/images/placeholders/ghost-of-tsushima/shot-05.svg", alt: "海岸晨曦" },
    ],
  },
]

async function main() {
  console.log("🌱 开始初始化数据...")

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: "admin" },
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10)
    await prisma.admin.create({
      data: { username: "admin", passwordHash },
    })
    console.log("✅ 管理员账号创建成功（用户名: admin, 密码: admin123）")
  } else {
    console.log("ℹ️ 管理员账号已存在，跳过")
  }

  for (const gameData of GAMES_DATA) {
    const existing = await prisma.game.findUnique({
      where: { slug: gameData.slug },
    })

    if (existing) {
      console.log(`ℹ️ 「${gameData.name}」已存在，跳过`)
      continue
    }

    const game = await prisma.game.create({
      data: {
        slug: gameData.slug,
        name: gameData.name,
        nameCn: gameData.nameCn,
        description: gameData.description,
        accentColor: gameData.accentColor,
        screenshots: {
          create: gameData.screenshots.map((shot, i) => ({
            src: shot.src,
            alt: shot.alt,
            width: 1920,
            height: 1080,
            sortOrder: i,
          })),
        },
      },
    })

    console.log(`✅ 「${game.name}」导入成功（${gameData.screenshots.length} 张截图）`)
  }

  console.log("🎉 数据初始化完成！")
}

main()
  .catch((e) => {
    console.error("❌ 种子脚本执行失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
