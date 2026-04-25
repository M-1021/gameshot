/**
 * NextAuth API 路由
 * 处理 /api/auth/* 的所有认证请求
 */
import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers
