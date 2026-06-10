"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export type HeadingRevealVariant = "standard" | "masked" | "none"

type GsapHeadingRevealProps = {
  children: ReactNode
  className?: string
  variant?: HeadingRevealVariant
}

export function GsapHeadingReveal({
  children,
  className = "",
  variant = "standard",
}: GsapHeadingRevealProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (variant === "none") return

      const root = rootRef.current
      if (!root) return

      const eyebrow = root.querySelector("[data-heading-reveal='eyebrow']")
      const heading = root.querySelector("[data-heading-reveal='title']")
      const description = root.querySelector("[data-heading-reveal='description']")

      if (!eyebrow && !heading && !description) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          once: true,
        },
      })

      if (variant === "masked") {
        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            {
              y: 14,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
            },
          )
        }

        if (heading) {
          tl.fromTo(
            heading,
            {
              y: 18,
              opacity: 0,
              filter: "blur(8px)",
              clipPath: "inset(0 0 100% 0)",
            },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "power3.out",
            },
            eyebrow ? "-=0.2" : 0,
          )
        }

        if (description) {
          tl.fromTo(
            description,
            {
              y: 18,
              opacity: 0,
              filter: "blur(8px)",
              clipPath: "inset(0 0 100% 0)",
            },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "power3.out",
            },
            heading ? "-=0.76" : 0,
          )
        }

        return
      }

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          {
            y: 14,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
          },
        )
      }

      if (heading) {
        tl.fromTo(
          heading,
          {
            y: 24,
            opacity: 0,
            letterSpacing: "0.08em",
          },
          {
            y: 0,
            opacity: 1,
            letterSpacing: "0em",
            duration: 0.85,
            ease: "power3.out",
          },
          eyebrow ? "-=0.25" : 0,
        )
      }

      if (description) {
        tl.fromTo(
          description,
          {
            y: 18,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          heading ? "-=0.45" : 0,
        )
      }
    },
    { dependencies: [variant], scope: rootRef },
  )

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
