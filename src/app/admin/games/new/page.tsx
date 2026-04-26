"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

/**
 * 新建游戏页面
 * 表单填写游戏基本信息，提交后创建游戏目录结构
 */
export default function NewGamePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    nameCn: "",
    description: "",
    accentColor: "#06b6d4",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!form.name.trim() && !form.nameCn.trim()) {
      setError("请至少填写游戏名称（英文或中文）")
      setLoading(false)
      return
    }

    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "创建失败")
      setLoading(false)
      return
    }

    const game = await res.json()
    router.push(`/admin/games/${game.id}`)
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-24 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回管理后台
        </Link>

        <h1 className="mb-8 text-3xl font-bold tracking-tight">新建游戏</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              游戏名称（英文）
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="如 Cyberpunk 2077"
              required
            />
            <p className="mt-1 text-xs text-zinc-400">
              URL 标识将自动从此生成（如 &quot;cyberpunk-2077&quot;）
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              游戏名称（中文）
            </label>
            <input
              type="text"
              value={form.nameCn}
              onChange={(e) => setForm({ ...form, nameCn: e.target.value })}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="如 赛博朋克 2077（选填）"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              游戏简介
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="用一段话描述这个游戏的摄影主题..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              主题色
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="h-9 w-12 cursor-pointer rounded-lg border border-zinc-300 bg-white p-0.5 dark:border-zinc-700"
              />
              <span className="text-xs text-zinc-400">{form.accentColor}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "创建中..." : "创建游戏"}
          </button>
        </form>
      </div>
    </div>
  )
}
