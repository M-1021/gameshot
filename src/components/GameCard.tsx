"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface GameCardProps {
  game: {
    slug: string
    name: string
    nameCn: string
    accentColor: string
    coverImage?: string | null
    screenshotCount?: number
  }
  index: number
}

/**
 * 游戏分类卡片
 * 显示在首页和 /games 列表页
 * 有封面图时显示图片，否则显示主题色占位
 */
export default function GameCard({ game, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={`/games/${game.slug}`}
        className="group relative block overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900"
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          {game.coverImage ? (
            <Image
              src={game.coverImage}
              alt={game.name}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800">
              <div className="flex flex-col items-center gap-2 p-6 text-center">
                <span
                  className="text-4xl"
                  style={{ color: game.accentColor }}
                >
                  {game.name.charAt(0)}
                </span>
                {game.screenshotCount !== undefined && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {game.screenshotCount} screenshots
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-xl font-bold text-white">{game.name}</h3>
          <p className="mt-1 text-sm text-zinc-300">{game.nameCn}</p>
        </div>

        <div
          className="absolute top-4 left-4 h-2 w-2 rounded-full"
          style={{ backgroundColor: game.accentColor }}
        />
      </Link>
    </motion.div>
  )
}
