/**
 * 单个截图管理 API
 * DELETE - 删除截图（同时删除图片文件）
 */
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { unlink } from "fs/promises"
import path from "path"

interface Params {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const screenshot = await prisma.screenshot.findUnique({
    where: { id: Number(id) },
  })

  if (!screenshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // 删除图片文件
  const filePath = path.join(process.cwd(), "public", screenshot.src)
  try {
    await unlink(filePath)
  } catch {
    // 文件不存在忽略
  }

  // 删除数据库记录
  await prisma.screenshot.delete({ where: { id: Number(id) } })

  return NextResponse.json({ success: true })
}
