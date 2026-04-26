"use client"

import { useState, FormEvent, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface ScreenshotItem {
  id: number
  src: string
  alt: string
  width: number
  height: number
  sortOrder: number
}

interface GameData {
  id: number
  slug: string
  name: string
  nameCn: string
  description: string
  coverImage: string | null
  accentColor: string
  screenshots: ScreenshotItem[]
}

interface Props {
  game: GameData
}

export default function EditGameForm({ game }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: game.name,
    nameCn: game.nameCn,
    description: game.description,
    accentColor: game.accentColor,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [dragOverCover, setDragOverCover] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const dragCounterRef = useRef(0)
  const coverDragCounterRef = useRef(0)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    const res = await fetch(`/api/games/${game.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setMessage("保存成功")
      router.refresh()
    } else {
      setMessage("保存失败")
    }
    setSaving(false)
  }

  async function handleUploads(files: FileList) {
    setUploading(true)
    setMessage("")
    let successCount = 0
    let failCount = 0
    let dupCount = 0

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("alt", file.name.replace(/\.[^/.]+$/, ""))

      const res = await fetch(`/api/games/${game.id}/screenshots`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        successCount++
      } else if (res.status === 409) {
        dupCount++
      } else {
        failCount++
      }
    }

    const parts: string[] = []
    if (successCount > 0) parts.push(`${successCount} 张成功`)
    if (dupCount > 0) parts.push(`${dupCount} 张重复跳过`)
    if (failCount > 0) parts.push(`${failCount} 张失败`)

    if (successCount > 0) {
      setMessage(`上传完成：${parts.join("，")}`)
      router.refresh()
    } else if (dupCount > 0) {
      setMessage(`全部 ${dupCount} 张已存在，无需重复上传`)
    } else {
      setMessage("上传失败")
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleDeleteScreenshot(id: number) {
    if (!confirm("确定删除这张截图？")) return

    setDeletingId(id)
    const res = await fetch(`/api/screenshots/${id}`, { method: "DELETE" })

    if (res.ok) {
      setMessage("已删除")
      router.refresh()
    } else {
      setMessage("删除失败")
    }
    setDeletingId(null)
  }

  async function handleCoverUpload(file: File) {
    setCoverUploading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json()
      setMessage(data.error || "上传失败")
      setCoverUploading(false)
      return
    }

    const { src } = await res.json()

    // 从封面提取主色调并自动设置为主题色
    extractDominantColor(file).then((color) => {
      setForm((f) => ({ ...f, accentColor: color }))
    })

    // 保存封面图路径到游戏记录
    const saveRes = await fetch(`/api/games/${game.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverImage: src }),
    })

    if (saveRes.ok) {
      setMessage("封面上传成功")
      router.refresh()
    } else {
      setMessage("封面保存失败")
    }
    setCoverUploading(false)
    if (coverInputRef.current) coverInputRef.current.value = ""
  }

  async function handleRemoveCover() {
    if (!confirm("确定移除封面图？")) return

    const res = await fetch(`/api/games/${game.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverImage: null }),
    })

    if (res.ok) {
      setMessage("封面已移除")
      router.refresh()
    } else {
      setMessage("移除失败")
    }
  }

  function extractDominantColor(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = 10
          canvas.height = 10
          const ctx = canvas.getContext("2d")!
          ctx.drawImage(img, 0, 0, 10, 10)
          const data = ctx.getImageData(0, 0, 10, 10).data
          const colorMap: Record<string, number> = {}
          for (let i = 0; i < data.length; i += 4) {
            const hex = "#" + [data[i], data[i + 1], data[i + 2]]
              .map((c) => c.toString(16).padStart(2, "0"))
              .join("")
            colorMap[hex] = (colorMap[hex] || 0) + 1
          }
          let dominant = "#06b6d4"
          let maxCount = 0
          for (const [hex, count] of Object.entries(colorMap)) {
            if (count > maxCount) { dominant = hex; maxCount = count }
          }
          resolve(dominant)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  function handleDragEnter() {
    dragCounterRef.current++
    setDragOver(true)
  }

  function handleDragLeave() {
    dragCounterRef.current--
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0
      setDragOver(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    dragCounterRef.current = 0
    const files = e.dataTransfer.files
    if (files.length > 0) handleUploads(files)
  }

  function handleCoverDragEnter() {
    coverDragCounterRef.current++
    setDragOverCover(true)
  }

  function handleCoverDragLeave() {
    coverDragCounterRef.current--
    if (coverDragCounterRef.current <= 0) {
      coverDragCounterRef.current = 0
      setDragOverCover(false)
    }
  }

  function handleCoverDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOverCover(false)
    coverDragCounterRef.current = 0
    const file = e.dataTransfer.files[0]
    if (file) handleCoverUpload(file)
  }

  return (
    <div>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回管理后台
      </Link>

      <h1 className="mb-2 text-3xl font-bold tracking-tight">编辑游戏</h1>
      <p className="mb-8 text-sm text-zinc-400">slug: {game.slug}</p>

      {message && (
        <div
          className={`mb-6 rounded-lg px-4 py-2 text-sm ${
            message.includes("失败") || message.includes("错误")
              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
          }`}
        >
          {message}
        </div>
      )}

      {/* 封面图管理 */}
      <div
        className={`mb-12 rounded-2xl border p-8 transition-colors ${
          dragOverCover
            ? "border-cyan-400 bg-cyan-50/30 dark:border-cyan-500 dark:bg-cyan-950/20"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        }`}
        onDragEnter={handleCoverDragEnter}
        onDragLeave={handleCoverDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleCoverDrop}
      >
        <h2 className="mb-4 text-lg font-semibold">封面图</h2>

        <div className="flex items-start gap-6">
          <div className="aspect-[4/3] w-48 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {game.coverImage ? (
              <Image
                src={game.coverImage}
                alt={`${game.name} 封面`}
                width={400}
                height={300}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleCoverUpload(file)
              }}
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-600 disabled:opacity-50"
            >
              {coverUploading ? "上传中..." : "上传封面"}
            </button>
            {game.coverImage && (
              <button
                onClick={handleRemoveCover}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                移除封面
              </button>
            )}
            <p className="text-xs text-zinc-400">推荐尺寸 800x600，支持 jpg/png/webp</p>
          </div>
        </div>
      </div>

      {/* 编辑表单 */}
      <form
        onSubmit={handleSave}
        className="mb-12 space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h2 className="text-lg font-semibold">基本信息</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              游戏名称（英文）
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
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
            />
          </div>
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
          disabled={saving}
          className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存修改"}
        </button>
      </form>

      {/* 截图管理 */}
      <div
        className={`rounded-2xl border bg-white p-8 transition-colors dark:bg-zinc-900 ${
          dragOver
            ? "border-cyan-400 bg-cyan-50/30 dark:border-cyan-500 dark:bg-cyan-950/20"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              截图管理（{game.screenshots.length} 张）
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              点击缩略图可预览，拖拽文件到此处即可上传
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files
                if (files && files.length > 0) handleUploads(files)
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl disabled:opacity-50"
            >
              {uploading ? "上传中..." : "+ 上传截图"}
            </button>
          </div>
        </div>

        {game.screenshots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-400">暂无截图，点击上方按钮上传</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {game.screenshots.map((shot) => (
              <div key={shot.id} className="group relative">
                <button
                  onClick={() => setPreviewSrc(shot.src)}
                  className="block w-full"
                >
                  <div className="flex items-center justify-center overflow-hidden rounded-xl bg-zinc-100 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700" style={{ height: 140 }}>
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </button>
                <p className="mt-1 truncate text-xs text-zinc-400">{shot.alt}</p>
                <button
                  onClick={() => handleDeleteScreenshot(shot.id)}
                  disabled={deletingId === shot.id}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500 disabled:opacity-50"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8 backdrop-blur-sm"
          onClick={() => setPreviewSrc(null)}
        >
          <button
            onClick={() => setPreviewSrc(null)}
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <Image
            src={previewSrc}
            alt="预览"
            width={1920}
            height={1080}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
