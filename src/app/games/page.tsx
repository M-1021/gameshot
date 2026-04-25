import { prisma } from "@/lib/prisma"
import GameCard from "@/components/GameCard"
import ScrollReveal from "@/components/ScrollReveal"

export default async function GamesPage() {
  const games = await prisma.game.findMany({
    include: { _count: { select: { screenshots: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-14">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              Games
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              游戏作品集
            </h1>
            <p className="mt-3 max-w-lg text-zinc-500 dark:text-zinc-400">
              按游戏分类浏览，每个系列都是一个独立的光影世界。
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game, i) => (
            <GameCard
              key={game.slug}
              game={{
                slug: game.slug,
                name: game.name,
                nameCn: game.nameCn,
                accentColor: game.accentColor,
                coverImage: game.coverImage,
                screenshotCount: game._count.screenshots,
              }}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
