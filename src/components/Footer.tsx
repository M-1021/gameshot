/**
 * 页脚组件
 * 显示版权信息和社交链接
 */
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-6 py-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        {/* 版权声明：自动获取当前年份 */}
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} GameShot. All rights reserved.
        </p>
        {/* 社交链接 */}
        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            Instagram
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
