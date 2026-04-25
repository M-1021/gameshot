/**
 * Prisma 客户端单例
 * 在开发环境中使用 globalThis 避免热重载时创建多个实例
 *
 * Prisma 7 + SQLite 需要 libsql 适配器
 */
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
})

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
