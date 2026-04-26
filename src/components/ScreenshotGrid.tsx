"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Screenshot } from "@/lib/types"
import Lightbox from "./Lightbox"

interface ScreenshotGridProps {
  screenshots: Screenshot[]
}

const PAGE_SIZE = 20

export default function ScreenshotGrid({ screenshots }: ScreenshotGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || visibleCount >= screenshots.length) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, screenshots.length))
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, screenshots.length])

  const visible = screenshots.slice(0, visibleCount)
  const hasMore = visibleCount < screenshots.length

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((shot, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            onClick={() => setLightboxIndex(i)}
            className="group relative mb-4 w-full overflow-hidden rounded-2xl bg-zinc-100 text-left dark:bg-zinc-900 break-inside-avoid"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              fetchPriority="low"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U0ZTRlNCIvPjwvc3ZnPg=="
              className="w-full h-auto transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          </motion.button>
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-8 flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-cyan-500 dark:border-zinc-700" />
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          screenshots={screenshots}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  )
}
