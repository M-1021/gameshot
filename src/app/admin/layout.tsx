/**
 * 管理后台布局
 * 提供基础结构但不包含 Navbar（管理后台使用自己的导航）
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
