/** 单张截图的类型定义 */
export interface Screenshot {
  src: string
  alt: string
  width: number
  height: number
}

/** 一个游戏分类的数据结构 */
export interface Game {
  slug: string
  name: string
  nameCn: string
  description: string
  coverImage: string | null
  accentColor: string
  screenshots: Screenshot[]
}

/** 导航链接 */
export interface NavLink {
  href: string
  label: string
}
