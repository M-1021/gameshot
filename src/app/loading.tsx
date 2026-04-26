export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-cyan-500 dark:border-zinc-700" />
        <p className="text-sm text-zinc-400">加载中...</p>
      </div>
    </div>
  )
}
