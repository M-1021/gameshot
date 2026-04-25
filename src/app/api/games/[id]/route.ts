/**
 * 单个游戏管理 API
 * GET    - 获取游戏详情（含截图）
 * PUT    - 更新游戏信息
 * DELETE - 删除游戏（级联删除截图和图片文件）
 */
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params
  const game = await prisma.game.findUnique({
    where: { id: Number(id) },
    include: { screenshots: { orderBy: { sortOrder: "asc" } } },
  })

  if (!game) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(game)
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { name, nameCn, description, accentColor, coverImage } = body

  const game = await prisma.game.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(nameCn && { nameCn }),
      ...(description !== undefined && { description }),
      ...(accentColor && { accentColor }),
      ...(coverImage !== undefined && { coverImage }),
    },
  })

  return NextResponse.json(game)
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  // 获取游戏信息，用于删除图片文件
  const game = await prisma.game.findUnique({
    where: { id: Number(id) },
    include: { screenshots: true },
  })

  if (!game) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // 删除游戏关联的图片文件
  const fs = await import("fs/promises")
  const path = await import("path")
  const gameDir = path.join(process.cwd(), "public", "images", "games", game.slug)

  try {
    await fs.rm(gameDir, { recursive: true, force: true })
  } catch {
    // 目录不存在忽略
  }

  // 删除数据库记录（级联删除截图）
  await prisma.game.delete({ where: { id: Number(id) } })

  return NextResponse.json({ success: true })
}
