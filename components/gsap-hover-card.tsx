"use client"

import type { MouseEvent, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

type GsapHoverCardProps = {
  children: ReactNode
  className?: string
}

export function GsapHoverCard({ children, className = "" }: GsapHoverCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [canTilt, setCanTilt] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const updateCanTilt = () => setCanTilt(mediaQuery.matches)

    updateCanTilt()
    mediaQuery.addEventListener("change", updateCanTilt)

    return () => mediaQuery.removeEventListener("change", updateCanTilt)
  }, [])

  useEffect(() => {
    if (canTilt) return

    const card = cardRef.current
    if (!card) return

    gsap.set(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      y: 0,
      clearProps: "transform",
    })
  }, [canTilt])

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card || !canTilt) return

    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const rotateY = gsap.utils.mapRange(0, rect.width, -5, 5, x)
    const rotateX = gsap.utils.mapRange(0, rect.height, 5, -5, y)

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.025,
      y: -5,
      transformPerspective: 900,
      transformOrigin: "center",
      duration: 0.25,
      ease: "power3.out",
      overwrite: true,
    })
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card || !canTilt) return

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      y: 0,
      duration: 0.45,
      ease: "elastic.out(1, 0.45)",
      overwrite: true,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${canTilt ? "cursor-pointer transform-gpu will-change-transform" : ""} ${className}`}
    >
      {children}
    </div>
  )
}
