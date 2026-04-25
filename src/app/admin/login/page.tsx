"use client"

import { useState, FormEvent, useEffect } from "react"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

/**
 * 管理员登录页面
 * 支持「记住我」选项：
 * - 勾选：auth_session cookie 持续 30 天
 * - 未勾选：auth_session cookie 为会话级别（关闭浏览器即失效）
 */
export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 如果 URL 携带 ?clear=1，先清除残留 JWT
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("clear") === "1") {
      signOut({ redirect: false })
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("用户名或密码错误")
      setLoading(false)
      return
    }

    // 设置 auth_session cookie 作为会话标记
    const maxAge = rememberMe ? 2592000 : undefined // 30 天 or 会话级
    document.cookie = `auth_session=1; path=/; SameSite=Lax${
      maxAge ? `; max-age=${maxAge}` : ""
    }`

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              GameShot
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">管理后台</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="请输入密码"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-cyan-500 focus:ring-cyan-500 dark:border-zinc-600"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">记住我</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  )
}
