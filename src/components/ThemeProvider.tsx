"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

/**
 * 主题提供者组件
 *
 * 保证服务端和客户端首次渲染一致：
 * - useState 固定初始化为 "dark"，首次渲染始终显示太阳图标
 * - useEffect 在 hydration 完成后读取 localStorage 切换到真实主题
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // Hydration 完成后从 localStorage 恢复用户偏好
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    const preferred = stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    // setState 在 mount 时执行一次，用于同步客户端真实主题
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(preferred)
    document.documentElement.classList.toggle("dark", preferred === "dark")
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
