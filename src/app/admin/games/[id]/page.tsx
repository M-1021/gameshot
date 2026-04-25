/**
 * 游戏编辑页面
 * 展示游戏信息表单 + 截图管理（上传/删除）
 * 服务端组件获取数据
 */
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EditGameForm from "./EditGameForm"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditGamePage({ params }: Props) {
  const { id } = await params

  const game = await prisma.game.findUnique({
    where: { id: Number(id) },
    include: { screenshots: { orderBy: { sortOrder: "asc" } } },
  })

  if (!game) notFound()

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-24 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <EditGameForm game={game} />
      </div>
    </div>
  )
}
