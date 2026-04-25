"use client"

import { ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number  // 动画延迟（秒），用于错开多个元素的出现顺序
}

/**
 * 滚动揭示动画组件
 * 包裹任意元素，当元素进入视口时触发淡入升起动画
 * 使用 Framer Motion 的 useInView 实现 IntersectionObserver
 * 每个元素只触发一次（once: true）
 *
 * 用法：
 * <ScrollReveal delay={0.2}>
 *   <h1>内容</h1>
 * </ScrollReveal>
 */
export default function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
