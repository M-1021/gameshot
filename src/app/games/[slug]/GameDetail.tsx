"use client"

import Link from "next/link"
import { Game } from "@/lib/types"
import ScrollReveal from "@/components/ScrollReveal"
import ScreenshotGrid from "@/components/ScreenshotGrid"

interface GameDetailProps {
  game: Game
  prev: { slug: string; name: string } | null
  next: { slug: string; name: string } | null
}

/**
 * 游戏详情页的客户端组件
 * 负责渲染游戏信息、截图网格和页面导航
 */
export default function GameDetail({ game, prev, next }: GameDetailProps) {
  return (
    <>
      <ScrollReveal>
        <div className="mb-14">
          <Link
            href="/games"
            prefetch
            className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Games
          </Link>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: game.accentColor }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: game.accentColor }}
              >
                {game.screenshots.length} Screenshots
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
              {game.nameCn || game.name}
            </h1>
            {game.nameCn && <p className="text-xl text-zinc-400">{game.name}</p>}
            <p className="mt-4 max-w-2xl leading-relaxed text-zinc-500 dark:text-zinc-400">
              {game.description}
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScreenshotGrid screenshots={game.screenshots} />

      <div className="mt-16 flex items-center justify-between border-t border-zinc-200 pt-8 dark:border-zinc-800">
        {prev ? (
          <Link
            href={`/games/${prev.slug}`}
            prefetch
            className="group flex flex-col items-start gap-1 transition-colors hover:text-cyan-500"
          >
            <span className="text-xs text-zinc-500">Previous</span>
            <span className="text-sm font-medium">{prev.name}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/games/${next.slug}`}
            prefetch
            className="group flex flex-col items-end gap-1 transition-colors hover:text-cyan-500"
          >
            <span className="text-xs text-zinc-500">Next</span>
            <span className="text-sm font-medium">{next.name}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </>
  )
}
