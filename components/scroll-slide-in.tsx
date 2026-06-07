"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollSlideInProps {
  children: React.ReactNode
  className?: string
  stagger?: number
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)

export function ScrollSlideIn({ children, className, stagger = 0 }: ScrollSlideInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0.2,
    transform: "translate3d(min(72vw, 520px), 0, 0)",
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setShouldReduceMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  useEffect(() => {
    const element = ref.current

    if (!element || shouldReduceMotion) {
      setStyle({ opacity: 1, transform: "translate3d(0, 0, 0)" })
      return
    }

    const updatePosition = () => {
      frameRef.current = null

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const start = viewportHeight * 0.92
      const distance = viewportHeight * 0.42
      const rawProgress = clamp((start - rect.top) / distance)
      const progress = clamp((rawProgress - stagger) / (1 - stagger))
      const eased = easeOutCubic(progress)
      const offset = (1 - eased) * Math.min(window.innerWidth * 0.72, 520)

      setStyle({
        opacity: 0.2 + eased * 0.8,
        transform: `translate3d(${offset}px, 0, 0)`,
      })
    }

    const requestUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updatePosition)
      }
    }

    updatePosition()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [shouldReduceMotion, stagger])

  return (
    <div ref={ref} className={cn("will-change-transform", className)} style={style}>
      {children}
    </div>
  )
}
