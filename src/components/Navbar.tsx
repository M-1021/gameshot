"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeToggle from "./ThemeToggle"

/** 导航链接配置 */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
]

/**
 * 全局导航栏
 * - 固定在页面顶部，带毛玻璃（backdrop-blur）效果
 * - 根据当前路径高亮对应链接
 * - 右侧包含主题切换按钮
 */
export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-zinc-200/40 bg-white/60 px-6 py-2.5 backdrop-blur-xl dark:border-zinc-800/40 dark:bg-black/60">
        {/* Logo：渐变色 GameShot 文字 */}
        <Link
          href="/"
          className="font-serif text-lg font-bold tracking-tight"
        >
          <span className="bg-linear-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            GameShot
          </span>
        </Link>

        {/* 导航链接 + 主题切换 */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
