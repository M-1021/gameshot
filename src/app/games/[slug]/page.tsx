import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import GameDetail from "./GameDetail"

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * 静态生成参数 - 构建时预渲染所有游戏页面
 */
export async function generateStaticParams() {
  const games = await prisma.game.findMany({
    select: { slug: true },
  })
  return games.map((game) => ({ slug: game.slug }))
}

/**
 * 游戏详情页（SSG）
 * 从数据库获取游戏数据和截图列表
 */
export default async function GamePage({ params }: Props) {
  const { slug } = await params

  const game = await prisma.game.findUnique({
    where: { slug },
    include: { screenshots: { orderBy: { sortOrder: "asc" } } },
  })

  if (!game) {
    notFound()
  }

  // 查找上/下一个游戏用于导航
  const allGames = await prisma.game.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "desc" },
  })
  const currentIndex = allGames.findIndex((g) => g.slug === slug)
  const prev = currentIndex > 0 ? allGames[currentIndex - 1] : null
  const next = currentIndex < allGames.length - 1 ? allGames[currentIndex + 1] : null

  // 映射为组件需要的格式
  const gameData = {
    slug: game.slug,
    name: game.name,
    nameCn: game.nameCn,
    description: game.description,
    coverImage: game.coverImage,
    accentColor: game.accentColor,
    screenshots: game.screenshots.map((s) => ({
      src: s.src,
      alt: s.alt,
      width: s.width,
      height: s.height,
    })),
  }

  return (
    <div className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-7xl">
        <GameDetail game={gameData} prev={prev} next={next} />
      </div>
    </div>
  )
}
