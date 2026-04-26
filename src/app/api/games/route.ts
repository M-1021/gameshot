/**
 * 游戏管理 API
 * GET  - 获取所有游戏列表
 * POST - 创建新游戏
 */
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

export async function GET() {
  const games = await prisma.game.findMany({
    include: { _count: { select: { screenshots: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(games)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, nameCn, description, accentColor } = body

  if (!name && !nameCn) {
    return NextResponse.json({ error: "请至少填写游戏名称（英文或中文）" }, { status: 400 })
  }

  const slugName = name || nameCn
  const slug = slugify(slugName)

  // 检查 slug 是否已存在
  const existing = await prisma.game.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: "该游戏已存在" }, { status: 409 })
  }

  // 先创建图片目录（失败时返回错误，避免孤儿 DB 记录）
  const fs = await import("fs/promises")
  const path = await import("path")
  const dir = path.join(process.cwd(), "public", "images", "games", slug)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {
    return NextResponse.json({ error: "创建目录失败" }, { status: 500 })
  }

  const game = await prisma.game.create({
    data: {
      slug,
      name: name || nameCn,
      nameCn: nameCn || name,
      description: description || "",
      accentColor: accentColor || "#06b6d4",
    },
  })

  revalidatePath(`/games/${slug}`)
  revalidatePath("/games")
  revalidatePath("/")

  return NextResponse.json(game, { status: 201 })
}
