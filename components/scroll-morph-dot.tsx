"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger, MorphSVGPlugin)

export type MorphKind = "website" | "services" | "process"

interface ScrollMorphDotProps {
  kind: MorphKind
  className?: string
}

interface MorphIconPaths {
  pre: string
  post: string
  details: string[]
  detailStrokeWidth: number
  preStroke?: {
    width: number
  }
}

function gradient(id: string) {
  return `url(#${id})`
}

const WEBSITE_PRE_PATHS = [
  "M26 13L77 61C79 63 78 67 75 67H56L66 84C68 87 67 91 64 93L55 97C52 99 48 98 46 94L36 75L25 88C23 91 18 89 18 85L17 18C17 14 22 11 26 13Z",
].join(" ")

const WEBSITE_POST_MAIN_PATHS = [
  "M16 13H84C88.4 13 92 16.6 92 21V68C92 72.4 88.4 76 84 76H16C11.6 76 8 72.4 8 68V21C8 16.6 11.6 13 16 13Z",
  "M45 76H55L58 88H42L45 76Z",
  "M36 88H64C67.3 88 70 90.7 70 94H30C30 90.7 32.7 88 36 88Z",
].join(" ")

const WEBSITE_DETAIL_PATHS = [
  "M8 28H92",
  "M21 20H21.5",
  "M31 20H31.5",
  "M41 20H41.5",
  "M23 42H43V58H23Z",
  "M55 42H78",
  "M55 53H78",
  "M55 64H70",
  "M23 68H78",
]

const SERVICES_PRE_PATHS = [
  "M25 8C37 5 49 10 55 20C61 31 60 44 52 54L78 82C86 90 84 103 74 109C64 115 51 109 48 97C47 93 45 88 42 84L18 56C9 53 3 45 2 35C1 29 2 23 5 18C7 15 10 14 13 17L23 27C29 33 38 32 44 26C50 19 47 10 38 8C33 7 29 7 25 8Z",
  "M68 86C74 82 83 84 87 91C91 98 88 107 81 111C74 115 65 112 61 105C57 98 60 90 68 86Z",
].join(" ")

const SERVICES_POST_MAIN_PATHS = [
  "M18 32H82C86.4 32 90 35.6 90 40V75C90 79.4 86.4 83 82 83H18C13.6 83 10 79.4 10 75V40C10 35.6 13.6 32 18 32Z",
  "M38 21H62C65.3 21 68 23.7 68 27V32H59V29H41V32H32V27C32 23.7 34.7 21 38 21Z",
].join(" ")

const SERVICES_DETAIL_PATHS = [
  "M10 49H90",
  "M25 46H35V60H25Z",
  "M65 46H75V60H65Z",
  "M37 70L52 55",
  "M48 55C49 51 53 48 58 49L54 53L59 58L64 54C65 59 62 64 57 65C54 66 51 65 49 63L40 72C38 74 35 74 34 72C32 70 33 68 35 66L44 57",
  "M74 65V79",
  "M67 72H81",
]

const PROCESS_PRE_PATHS = [
  "M32 34C32 22 41 14 53 14C66 14 76 23 76 35C76 45 70 51 60 57C53 61 50 66 50 73",
  "M50 88H50.5",
].join(" ")

const PROCESS_POST_MAIN_PATHS = [
  "M23 20H77C81.4 20 85 23.6 85 28V78C85 82.4 81.4 86 77 86H23C18.6 86 15 82.4 15 78V28C15 23.6 18.6 20 23 20Z",
  "M39 13H61C64.3 13 67 15.7 67 19V26H33V19C33 15.7 35.7 13 39 13Z",
].join(" ")

const PROCESS_DETAIL_PATHS = [
  "M31 37L37 43L48 31",
  "M58 39H74",
  "M31 55L37 61L48 49",
  "M58 57H74",
  "M31 72L37 78L48 66",
  "M58 74H74",
  "M50 18H50.5",
]

const MORPH_PATHS: Record<MorphKind, MorphIconPaths> = {
  website: {
    pre: WEBSITE_PRE_PATHS,
    post: WEBSITE_POST_MAIN_PATHS,
    details: WEBSITE_DETAIL_PATHS,
    detailStrokeWidth: 4.2,
  },
  services: {
    pre: SERVICES_PRE_PATHS,
    post: SERVICES_POST_MAIN_PATHS,
    details: SERVICES_DETAIL_PATHS,
    detailStrokeWidth: 4.5,
  },
  process: {
    pre: PROCESS_PRE_PATHS,
    post: PROCESS_POST_MAIN_PATHS,
    details: PROCESS_DETAIL_PATHS,
    detailStrokeWidth: 4.8,
    preStroke: {
      width: 12,
    },
  },
}

function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(() => {
    if (typeof window === "undefined") return false

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setShouldReduceMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  return shouldReduceMotion
}

export function ScrollMorphDot({ kind, className }: ScrollMorphDotProps) {
  const gradientId = `${useId().replace(/:/g, "")}-scroll-morph-gradient`
  const rootRef = useRef<HTMLSpanElement | null>(null)
  const morphPathRef = useRef<SVGPathElement | null>(null)
  const targetPathRef = useRef<SVGPathElement | null>(null)
  const detailGroupRef = useRef<SVGGElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const paths = MORPH_PATHS[kind]
  const gradientPaint = gradient(gradientId)

  useGSAP(
    () => {
      const root = rootRef.current
      const morphPath = morphPathRef.current
      const targetPath = targetPathRef.current
      const detailGroup = detailGroupRef.current

      if (!root || !morphPath || !targetPath) return
      const trigger = root.parentElement ?? root

      if (shouldReduceMotion) {
        gsap.set(morphPath, {
          attr: {
            d: paths.post,
            fill: gradientPaint,
            stroke: "none",
            "stroke-width": 0,
          },
        })
        gsap.set(detailGroup, { autoAlpha: 1 })

        return
      }

      gsap.set(detailGroup, { autoAlpha: 0 })
      gsap.set(morphPath, {
        attr: {
          d: paths.pre,
          fill: paths.preStroke ? "none" : gradientPaint,
          stroke: paths.preStroke ? gradientPaint : "none",
          "stroke-width": paths.preStroke?.width ?? 0,
        },
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top 75%",
          end: "top 45%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .to(morphPath, {
          attr: {
            fill: gradientPaint,
            stroke: "none",
            "stroke-width": 0,
          },
          // Change shapeIndex to "log" later to capture the optimized value in the console, then replace it with that numeric value.
          morphSVG: {
            shape: targetPath,
            shapeIndex: "auto",
          },
          ease: "none",
        })
        .set(detailGroup, { autoAlpha: 1 }, 0.82)
    },
    { dependencies: [gradientPaint, kind, paths.post, paths.pre, paths.preStroke, shouldReduceMotion], revertOnUpdate: true, scope: rootRef },
  )

  return (
    <span ref={rootRef} aria-hidden="true" className={cn("inline-flex shrink-0", className)}>
      <svg
        viewBox="0 0 100 100"
        className="h-48 w-48 overflow-visible md:h-56 md:w-56"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="10"
            y1="8"
            x2="90"
            y2="92"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff850b" />
            <stop offset="45%" stopColor="#ff5f8f" />
            <stop offset="100%" stopColor="#b86bff" />
          </linearGradient>
        </defs>
        <path
          ref={morphPathRef}
          d={shouldReduceMotion ? paths.post : paths.pre}
          fill={paths.preStroke && !shouldReduceMotion ? "none" : gradientPaint}
          stroke={paths.preStroke && !shouldReduceMotion ? gradientPaint : "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={paths.preStroke && !shouldReduceMotion ? paths.preStroke.width : 0}
        />
        <path
          ref={targetPathRef}
          d={paths.post}
          fill={gradientPaint}
          stroke="none"
          visibility="hidden"
        />
        <g
          ref={detailGroupRef}
          fill="none"
          stroke="#080b10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={paths.detailStrokeWidth}
          visibility={shouldReduceMotion ? "visible" : "hidden"}
        >
          {paths.details.map((path) => (
            <path key={path} d={path} />
          ))}
        </g>
      </svg>
    </span>
  )
}
