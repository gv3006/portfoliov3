"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface GsapSlotNumberProps {
  value: string
  className?: string
  delay?: number
  ariaLabel?: string
}

const digits = Array.from({ length: 30 }, (_, index) => String(index % 10))

function getSlotTrigger(root: HTMLElement) {
  return root.closest<HTMLElement>("[data-slot-trigger], article, .group") ?? root
}

function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setShouldReduceMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  return shouldReduceMotion
}

export function GsapSlotNumber({
  value,
  className,
  delay = 0,
  ariaLabel,
}: GsapSlotNumberProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const characters = useMemo(() => Array.from(value), [value])

  useGSAP(
    () => {
      const root = rootRef.current

      if (!root) return

      const reels = gsap.utils.toArray<HTMLElement>("[data-slot-reel]", root)
      const trigger = getSlotTrigger(root)

      if (reels.length === 0 || shouldReduceMotion) {
        gsap.set(root, { autoAlpha: 1, scale: 1 })

        reels.forEach((reel) => {
          const target = Number(reel.dataset.slotTarget ?? 0)
          gsap.set(reel, { y: `${-target}em` })
        })

        return
      }

      gsap.set(root, {
        autoAlpha: 0,
        scale: 0.96,
        transformOrigin: "50% 50%",
      })

      reels.forEach((reel) => {
        const start = Number(reel.dataset.slotStart ?? 0)
        gsap.set(reel, { y: `${-start}em` })
      })

      const timeline = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger,
          start: "top 92%",
          once: true,
          invalidateOnRefresh: true,
        },
      })

      timeline.to(
        root,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.32,
          ease: "power2.out",
        },
        0,
      )

      reels.forEach((reel, index) => {
        const target = Number(reel.dataset.slotTarget ?? 0)

        timeline
          .to(
            reel,
            {
              y: `${-(target + 0.28)}em`,
              duration: 0.92,
              ease: "power3.inOut",
            },
            index === 0 ? 0 : index * 0.06,
          )
          .to(
            reel,
            {
              y: `${-target}em`,
              duration: 1,
              ease: "back.out(2.2)",
            },
            ">-0.05",
          )
      })
    },
    {
      dependencies: [delay, shouldReduceMotion, value],
      revertOnUpdate: true,
      scope: rootRef,
    },
  )

  return (
    <span
      ref={rootRef}
      aria-label={ariaLabel ?? value}
      className={cn("inline-flex items-start leading-none tabular-nums", className)}
    >
      <span aria-hidden="true" className="inline-flex items-start">
        {characters.map((character, index) => {
          const digit = Number(character)

          if (!Number.isInteger(digit)) {
            return (
              <span key={`${character}-${index}`} className="inline-block leading-none">
                {character}
              </span>
            )
          }

          const target = digit + 20
          const start = digit + 10

          return (
            <span
              key={`${character}-${index}`}
              className="inline-block h-[1em] w-[0.72em] overflow-hidden leading-none"
            >
              <span
                data-slot-reel=""
                data-slot-start={start}
                data-slot-target={target}
                className="block will-change-transform"
              >
                {digits.map((slotDigit, slotIndex) => (
                  <span key={`${slotDigit}-${slotIndex}`} className="block h-[1em] leading-none">
                    {slotDigit}
                  </span>
                ))}
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
