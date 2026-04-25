/**
 * 管理后台首页
 * 展示所有游戏列表，提供新建、编辑、删除操作
 * 服务端组件获取数据，客户端组件处理交互
 */
import { prisma } from "@/lib/prisma"
import AdminDashboard from "./AdminDashboard"

export default async function AdminPage() {
  const games = await prisma.game.findMany({
    include: { _count: { select: { screenshots: true } } },
    orderBy: { createdAt: "desc" },
  })

  return <AdminDashboard games={games} />
}
