"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Screenshot } from "@/lib/types"
import Lightbox from "./Lightbox"

interface ScreenshotGridProps {
  screenshots: Screenshot[]
}

/**
 * 截图网格组件
 * 响应式布局：
 * - 桌面（lg）：3 列
 * - 平板（sm）：2 列
 * - 移动端：1 列
 *
 * 点击任意截图会打开 Lightbox 灯箱浏览
 * 每张截图有独立的滚动渐入动画，延迟按索引递增
 */
export default function ScreenshotGrid({ screenshots }: ScreenshotGridProps) {
  // 当前打开的灯箱索引，null 表示关闭
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {screenshots.map((shot, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            onClick={() => setLightboxIndex(i)}
            className="group relative overflow-hidden rounded-2xl bg-zinc-100 text-left dark:bg-zinc-900"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              {/* 使用 Next.js Image 组件自动优化图片 */}
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* 悬停遮罩 */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          </motion.button>
        ))}
      </div>

      {/* 灯箱：仅在选中截图时渲染 */}
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
