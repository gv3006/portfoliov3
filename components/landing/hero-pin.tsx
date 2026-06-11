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

      const copy = trigger.querySelector<HTMLElement>("[data-hero-pin-copy]")
      const endBoundary = document.querySelector<HTMLElement>("[data-hero-pin-end]")

      const getPinDistance = () => {
        if (!copy || !endBoundary) {
          return 1
        }

        const triggerTop = trigger.getBoundingClientRect().top + window.scrollY
        const boundaryTop = endBoundary.getBoundingClientRect().top + window.scrollY
        const copyBottom = copy.getBoundingClientRect().bottom
        const gap = gsap.utils.clamp(24, 56, window.innerHeight * 0.045)
        const targetBoundaryY = Math.min(window.innerHeight - gap, copyBottom + gap)

        return Math.max(boundaryTop - targetBoundaryY - triggerTop, 1)
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger,
        pin,
        start: "top top",
        end: () => `+=${getPinDistance()}`,
        pinSpacing: false,
        invalidateOnRefresh: true,
        anticipatePin: 1,
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
