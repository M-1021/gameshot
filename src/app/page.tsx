import Link from "next/link"
import { prisma } from "@/lib/prisma"
import HomeHero from "@/components/HomeHero"
import GameCard from "@/components/GameCard"
import ScrollReveal from "@/components/ScrollReveal"

export default async function Home() {
  const games = await prisma.game.findMany({
    include: { _count: { select: { screenshots: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col">
      <HomeHero />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mb-14">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
                Collection
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                精选作品
              </h2>
              <p className="mt-3 max-w-lg text-zinc-500 dark:text-zinc-400">
                从夜城霓虹到交界地史诗，每张截图都是一个值得定格的瞬间。
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

          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <Link
                href="/games"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                浏览全部游戏
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
                About
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                关于 GameShot
              </h2>
              <p className="mt-6 leading-relaxed text-zinc-500 dark:text-zinc-400">
                这是一个个人游戏摄影作品集。我热衷于在虚拟世界中寻找美的瞬间，
                用截图记录那些令人惊叹的画面。每一张作品都是对游戏艺术的一次致敬。
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
