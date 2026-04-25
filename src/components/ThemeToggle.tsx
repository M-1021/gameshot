"use client"

import { useTheme } from "./ThemeProvider"

/**
 * 主题切换按钮
 * 当前为深色模式时显示太阳图标（点击切浅色）
 * 当前为浅色模式时显示月亮图标（点击切深色）
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        // 太阳图标：当前暗色模式，点击切亮色
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        // 月亮图标：当前亮色模式，点击切暗色
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}
