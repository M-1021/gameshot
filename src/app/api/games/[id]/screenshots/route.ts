/**
 * 截图管理 API
 * GET  - 获取游戏的所有截图
 * POST - 上传新截图（multipart/form-data）
 */
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import crypto from "crypto"

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params
  const screenshots = await prisma.screenshot.findMany({
    where: { gameId: Number(id) },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(screenshots)
}

export async function POST(request: Request, { params }: Params) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const gameId = Number(id)

  // 验证游戏存在
  const game = await prisma.game.findUnique({ where: { id: gameId } })
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const alt = (formData.get("alt") as string) || ""

  if (!file) {
    return NextResponse.json({ error: "请选择图片文件" }, { status: 400 })
  }

  // 校验文件类型
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "不支持的图片格式，支持 jpg/png/webp/svg" }, { status: 400 })
  }

  // 校验文件大小（50MB）
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "图片大小不能超过 50MB" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // SHA-256 查重
  const hash = crypto.createHash("sha256").update(buffer).digest("hex")
  const duplicate = await prisma.screenshot.findFirst({ where: { hash } })
  if (duplicate) {
    return NextResponse.json({ error: "该图片已存在，无需重复上传" }, { status: 409 })
  }

  // 保存文件到游戏目录
  const ext = file.name.split(".").pop() || "jpg"
  const timestamp = Date.now()
  const filename = `shot-${timestamp}.${ext}`
  const gameDir = path.join(process.cwd(), "public", "images", "games", game.slug)

  try {
    await mkdir(gameDir, { recursive: true })
    await writeFile(path.join(gameDir, filename), buffer)
  } catch {
    return NextResponse.json({ error: "保存文件失败" }, { status: 500 })
  }

  const imageSrc = `/images/games/${game.slug}/${filename}`

  // 获取当前最大排序值
  const lastScreenshot = await prisma.screenshot.findFirst({
    where: { gameId },
    orderBy: { sortOrder: "desc" },
  })

  const screenshot = await prisma.screenshot.create({
    data: {
      gameId,
      src: imageSrc,
      alt,
      width: 1920,
      height: 1080,
      sortOrder: (lastScreenshot?.sortOrder ?? -1) + 1,
      hash,
    },
  })

  revalidatePath(`/games/${game.slug}`)
  revalidatePath("/games")

  return NextResponse.json(screenshot, { status: 201 })
}
