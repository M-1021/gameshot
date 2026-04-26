import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { currentPassword, newPassword } = await request.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "请提供当前密码和新密码" }, { status: 400 })
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "新密码至少 6 个字符" }, { status: 400 })
  }

  const admin = await prisma.admin.findFirst()
  if (!admin) {
    return NextResponse.json({ error: "管理员不存在" }, { status: 404 })
  }

  const isValid = await bcrypt.compare(currentPassword, admin.passwordHash)
  if (!isValid) {
    return NextResponse.json({ error: "当前密码错误" }, { status: 403 })
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  })

  return NextResponse.json({ success: true })
}
