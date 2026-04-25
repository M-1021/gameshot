/**
 * 工具函数
 */

/**
 * 将字符串转为 URL 友好的 slug
 * 例如: "Cyberpunk 2077" -> "cyberpunk-2077"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
