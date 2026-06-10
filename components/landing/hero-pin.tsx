"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface HeroPinProps {
  children: ReactNode
}

export function HeroPin({ children }: HeroPinProps) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const trigger = triggerRef.current
      const pin = pinRef.current

      if (!trigger || !pin) {
        return
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger,
        pin,
        start: "top top",
        end: "bottom bottom",
        pinSpacing: false,
        invalidateOnRefresh: true,
      })

      return () => scrollTrigger.kill()
    },
    { scope: triggerRef },
  )

  return (
    <div ref={triggerRef} className="relative h-[125vh] bg-black md:h-[135vh]">
      <div ref={pinRef} className="h-screen overflow-hidden">
        {children}
      </div>
    </div>
  )
}
