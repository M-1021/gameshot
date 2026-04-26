"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"

/**
 * 首页英雄区
 * 功能：
 * - 全屏展示，包含两个径向渐变背景层
 * - 视差滚动效果（背景随滚动以 0.4 倍速移动）
 * - 标题和按钮的递进动画
 * - 底部滚动指示器（鼠标图标 + 浮动动画）
 */
export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * 视差滚动效果
   * 监听 scroll 事件，让背景层以滚动距离的 0.4 倍速垂直移动
   * 产生深度层次感
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrolled = window.scrollY
      const parallax = scrolled * 0.4
      containerRef.current.style.transform = `translateY(${parallax}px)`
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* 视差背景层：青色渐变（右上）和紫色渐变（左下） */}
      <div
        ref={containerRef}
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.1),transparent_50%)]" />
        {/* SVG 噪声纹理 */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* 浮动光点 */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -30, 20], x: [15, -15, 15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [-10, 25, -10], x: [-5, 20, -5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-1/3 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl"
      />

      {/* 前景内容 */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* 顶部标签 */}
        <ScrollReveal>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 inline-block rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
          >
            Game Photography Portfolio
          </motion.span>
        </ScrollReveal>

        {/* 主标题：渐变色 "光影捕手" */}
        <ScrollReveal delay={0.15}>
          <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            虚拟世界的
            <br />
            <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              光影捕手
            </span>
          </h1>
        </ScrollReveal>

        {/* 副标题 */}
        <ScrollReveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            用镜头探索游戏世界的每一处细节，将令人惊叹的视觉瞬间定格为永恒。
          </p>
        </ScrollReveal>

        {/* 按钮组 */}
        <ScrollReveal delay={0.45}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.a
              href="/games"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-linear-to-r from-cyan-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-shadow hover:shadow-xl hover:shadow-cyan-500/30"
            >
              浏览作品集
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-semibold transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              了解更多
            </motion.a>
          </div>
        </ScrollReveal>
      </div>

      {/* 滚动指示器：鼠标图标 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="30" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400">
            <rect x="2" y="2" width="20" height="32" rx="10" />
            <path d="M12 10v8" />
            <circle cx="12" cy="26" r="1.5" fill="currentColor" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
