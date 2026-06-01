"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  distance?: number
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 28,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const initial: Record<Props["direction"] & string, string> = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
    fade: "none",
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initial[direction],
        transition: `opacity 0.65s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}
