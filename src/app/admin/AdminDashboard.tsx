"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setError("两次密码输入不一致")
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("新密码至少 6 个字符")
      setLoading(false)
      return
    }

    const res = await fetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error || "修改失败")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-xl font-bold tracking-tight">修改密码</h2>
        {success ? (
          <div>
            <p className="mb-4 text-sm text-green-600 dark:text-green-400">密码修改成功</p>
            <button onClick={onClose}
              className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >关闭</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">当前密码</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">新密码</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">确认新密码</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                required />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >取消</button>
              <button type="submit" disabled={loading}
                className="flex-1 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 disabled:opacity-50"
              >{loading ? "修改中..." : "确认修改"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

interface GameItem {
  id: number
  slug: string
  name: string
  nameCn: string
  accentColor: string
  coverImage: string | null
  _count: { screenshots: number }
}

interface Props {
  games: GameItem[]
}

/**
 * 管理后台仪表盘
 * 展示游戏列表，提供新建/编辑/删除操作
 */
export default function AdminDashboard({ games }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<number | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  async function handleDelete(id: number, name: string) {
    if (!confirm(`确定要删除「${name}」吗？所有截图将被永久删除。`)) return

    setDeleting(id)
    const res = await fetch(`/api/games/${id}`, { method: "DELETE" })

    if (res.ok) {
      router.refresh()
    } else {
      alert("删除失败，请重试")
    }
    setDeleting(null)
  }

  async function handleLogout() {
    // 清除 auth_session cookie 后登出，确保下次需重新登录
    document.cookie = "auth_session=; path=/; max-age=0"
    await signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-24 dark:bg-black">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
            <p className="mt-1 text-sm text-zinc-500">管理游戏作品与截图</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-300"
            >
              返回前台
            </Link>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              修改密码
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              退出登录
            </button>
            <Link
              href="/admin/games/new"
              className="rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl"
            >
              + 新建游戏
            </Link>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 p-16 text-center dark:border-zinc-800">
            <p className="text-zinc-400">暂无游戏，点击上方按钮新建</p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-6 py-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: game.accentColor }}
                  />
                  <div>
                    <h3 className="font-semibold">{game.nameCn || game.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {(game.nameCn ? game.name : game.nameCn) || game.name} &middot; {game._count.screenshots} 张截图
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/games/${game.slug}`}
                    className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    预览
                  </Link>
                  <Link
                    href={`/admin/games/${game.id}`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-cyan-600 transition-colors hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(game.id, game.name)}
                    disabled={deleting === game.id}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                  >
                    {deleting === game.id ? "删除中..." : "删除"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  )
}
