"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollSlideInProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  rootMargin?: string
  threshold?: number
}

export function ScrollSlideIn({
  children,
  className,
  stagger = 0,
  rootMargin = "-18% 0px -18% 0px",
  threshold = 0,
}: ScrollSlideInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

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
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin, threshold },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [rootMargin, shouldReduceMotion, threshold])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-[min(72vw,520px)] opacity-20",
        className,
      )}
      style={!shouldReduceMotion && isVisible ? { transitionDelay: `${stagger * 1000}ms` } : undefined}
    >
      {children}
    </div>
  )
}
