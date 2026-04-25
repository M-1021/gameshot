/**
 * Next.js Proxy（替代已弃用的 middleware）
 * 保护 /admin/* 路由，未登录时重定向到 /admin/login
 *
 * 会话机制：
 * - JWT 由 NextAuth 管理（用于识别身份）
 * - auth_session cookie 作为「会话标记」（用于控制持久登录）
 * - 关闭浏览器后 auth_session 丢失 → 需重新登录
 * - 勾选「记住我」→ auth_session 持续 30 天
 */
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  const authSession = req.cookies.get("auth_session")
  const isLoggedIn = !!token

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // JWT 有效但 auth_session 已过期 → 强制重登
    if (!authSession) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("clear", "1")
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname === "/admin/login" && isLoggedIn && authSession) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
