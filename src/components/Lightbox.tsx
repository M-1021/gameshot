"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Screenshot } from "@/lib/types"

interface LightboxProps {
  screenshots: Screenshot[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

/**
 * 截图灯箱组件
 * 全屏展示大图，支持：
 * - 键盘导航：左右箭头切换，Esc 关闭
 * - 切换动画：缩放 + 淡入淡出
 * - 显示当前页码和图片描述
 * - 点击背景关闭
 * - 打开时禁止页面滚动
 */
export default function Lightbox({ screenshots, currentIndex, onClose, onNavigate }: LightboxProps) {
  const current = screenshots[currentIndex]

  /**
   * 键盘事件处理
   * 使用 useCallback 包裹以避免每次渲染重新创建函数
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1)
      if (e.key === "ArrowRight" && currentIndex < screenshots.length - 1) onNavigate(currentIndex + 1)
    },
    [currentIndex, screenshots.length, onClose, onNavigate]
  )

  useEffect(() => {
    // 注册键盘事件
    document.addEventListener("keydown", handleKeyDown)
    // 禁止页面滚动
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      // 恢复页面滚动
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        onClick={onClose} // 点击背景关闭
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* 上一张按钮 */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* 下一张按钮 */}
        {currentIndex < screenshots.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* 图片主体：切换时带缩放动画 */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative max-h-full max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            priority
          />
          {/* 页码 + 图片描述 */}
          <p className="mt-3 text-center text-sm text-zinc-400">
            {currentIndex + 1} / {screenshots.length} &mdash; {current.alt}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
