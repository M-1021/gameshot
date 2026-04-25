import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

/*
 * 使用 next/font 加载 Geist 字体（Vercel 的现代字体）
 * variable 方式注入，通过 CSS 变量全局生效
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

/** 全局 SEO 元信息 */
export const metadata: Metadata = {
  title: "GameShot | Game Photography Portfolio",
  description: "A personal collection of game photography and screenshots.",
}

/**
 * 根布局组件
 * 包裹所有页面，提供：
 * - 字体加载
 * - 主题上下文（ThemeProvider）
 * - 全局导航栏（Navbar）
 * - 页脚（Footer）
 *
 * suppressHydrationWarning：因为 ThemeProvider 在客户端
 * 才确定主题，服务端渲染与客户端可能存在 class 不一致
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
