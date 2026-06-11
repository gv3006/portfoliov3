"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger, MorphSVGPlugin)

export type MorphKind = "website" | "services" | "process" | "faq"

type MorphShapeIndex = "auto" | "log" | number | number[]

interface ScrollMorphDotProps {
  kind: MorphKind
  className?: string
  shapeIndex?: MorphShapeIndex
  morphOrigin?: string
}

interface MorphIconPaths {
  preBase: string
  preFillDetails?: string[]
  postBase: string
  postFillDetails?: string[]
  postCutoutDetails?: string[]
  origin?: string
  shapeIndex?: MorphShapeIndex
}

function gradient(id: string) {
  return `url(#${id})`
}

/* -------------------------------------------------------------------------- */
/* Website: cursor -> monitor screen, then delayed reveal of frame/cutouts     */
/* -------------------------------------------------------------------------- */

const WEBSITE_PRE_BASE_PATHS =
  "M23.88 12.32 L76.88 57.73 Q78.25 58.90 76.45 58.90 L59.20 58.90 Q56.80 58.90 57.83 61.07 L67.06 80.44 Q68.35 83.15 65.64 84.45 L60.33 86.99 Q57.80 88.20 56.54 85.70 L47.22 67.27 Q46.05 64.95 44.33 66.90 L33.60 79.10 Q31.75 81.20 31.36 78.43 L22.14 13.27 Q21.75 10.50 23.88 12.32 Z"
const WEBSITE_POST_BASE_PATHS =
  "M9.94 27.30 L89.77 27.30 L89.77 66.77 L9.94 66.77 Z"

const WEBSITE_POST_FILL_DETAILS = [
  // Browser/top bar
  "M9.94 16.91 L9.94 25.22 L10.23 25.52 L89.77 25.52 L89.77 16.61 L88.88 14.54 L86.21 12.46 L13.50 12.46 L10.83 14.54 Z",

  // Bottom monitor bar
  "M9.94 68.55 L89.77 68.55 L89.77 71.81 L87.99 74.78 L85.32 75.97 L14.39 75.97 L12.61 75.37 L10.83 73.59 L9.94 71.81 Z",

  // Stand
  "M30.71 84.87 L31.60 83.98 L39.02 83.98 L39.91 82.20 L40.50 78.05 L41.10 77.45 L58.01 77.45 L59.20 83.39 L59.79 83.98 L67.21 83.98 L68.10 85.17 L68.10 86.35 L66.92 87.54 L31.60 87.54 L30.71 86.65 Z",
]

const WEBSITE_POST_CUTOUT_DETAILS = [
  // Left content block
  "M18.54 35.31 L19.73 34.42 L39.91 34.42 L40.50 34.72 L41.39 35.90 L41.39 52.52 L40.50 53.71 L19.14 53.71 L18.25 52.52 L18.25 35.90 Z",

  // Lower content line
  "M19.43 58.75 L80.27 58.75 L81.16 59.65 L81.16 60.83 L80.27 61.72 L19.14 61.72 L18.25 60.83 L18.25 59.65 Z",

  // Right content lines
  "M46.74 35.61 L47.92 34.72 L79.97 34.72 L81.16 35.61 L81.16 37.09 L80.27 37.98 L47.92 37.98 L46.74 37.09 Z",
  "M46.74 43.62 L47.92 42.73 L79.97 42.73 L81.16 43.62 L81.16 45.10 L80.27 45.99 L47.92 45.99 L46.74 45.10 Z",
  "M46.74 51.63 L47.92 50.45 L66.03 50.45 L67.21 51.34 L67.21 52.82 L66.32 53.71 L47.92 53.71 L46.74 52.82 Z",

  // Browser dots
  "M18.25 17.21 L20.03 17.50 L20.92 18.69 L20.92 20.17 L19.73 21.36 L17.95 21.36 L16.76 20.17 L16.76 18.39 Z",
  "M24.77 17.21 L26.26 17.21 L27.74 18.39 L28.04 19.28 L27.74 20.17 L26.55 21.36 L24.77 21.36 L23.59 20.17 L23.59 18.39 Z",
  "M31.90 17.21 L33.08 17.21 L34.57 18.39 L34.86 19.28 L34.57 20.17 L33.38 21.36 L31.60 21.36 L30.41 20.17 L30.41 18.69 Z",
]

const SERVICES_PRE_BASE_PATHS =
  "M24.89 10.86 L24.27 11.80 L31.76 19.59 L32.07 23.02 L31.44 24.89 L28.01 28.33 L25.83 28.95 L23.96 28.95 L22.09 28.33 L14.92 21.78 L13.98 21.78 L13.67 22.40 L13.98 27.39 L14.92 30.20 L16.79 33.32 L19.59 36.12 L22.09 37.68 L24.58 38.62 L28.64 39.24 L32.07 40.80 L34.25 42.36 L39.24 47.35 L61.38 71.67 L63.88 76.04 L65.44 81.65 L66.68 84.15 L68.56 86.33 L71.36 88.20 L74.79 89.14 L77.60 89.14 L80.09 88.52 L83.21 86.64 L86.02 83.21 L87.27 79.78 L86.96 75.11 L85.08 71.36 L81.97 68.56 L79.47 67.31 L76.98 66.68 L71.99 63.88 L65.44 57.33 L52.96 43.29 L44.85 34.87 L42.67 31.13 L42.05 28.95 L41.42 20.53 L40.18 17.41 L38.31 14.92 L35.19 12.42 L31.44 10.86 L30.20 10.86 L29.88 10.55 L25.83 10.55 Z"

const SERVICES_PRE_FILL_DETAILS = [
  // Wrench/socket end detail
  "M76.04 70.74 L77.29 70.74 L78.54 71.99 L81.03 72.30 L81.34 72.61 L81.34 73.86 L83.53 75.73 L82.90 77.60 L83.84 79.47 L83.53 80.41 L81.97 81.65 L81.65 83.21 L80.72 84.15 L80.09 83.84 L79.16 84.15 L77.60 85.71 L76.98 85.71 L75.42 84.77 L74.17 85.40 L72.92 85.08 L71.99 83.53 L70.43 83.21 L69.80 82.59 L69.80 80.72 L68.56 79.47 L68.56 78.22 L69.49 77.29 L69.18 75.11 L71.67 73.23 L71.99 71.99 L72.61 71.67 L75.11 71.67 Z",
]

const SERVICES_POST_BASE_PATHS =
  "M8.31 34.76 L8.31 45.11 L10.04 47.99 L10.04 80.19 L10.61 81.62 L12.34 83.35 L13.49 83.92 L85.94 83.92 L87.95 82.77 L89.39 80.19 L89.39 47.99 L90.82 45.40 L90.82 33.90 L90.25 32.46 L88.52 30.74 L87.09 30.16 L69.26 30.16 L68.97 29.88 L68.97 22.11 L66.67 19.52 L63.51 18.09 L35.91 18.09 L34.76 18.38 L32.17 19.81 L30.74 21.82 L29.87 30.16 L12.34 30.16 L9.46 31.89 Z M35.05 24.70 L36.20 23.26 L62.94 23.26 L64.09 24.41 L64.09 29.88 L63.80 30.16 L35.34 30.16 L35.05 29.88 Z"

const SERVICES_POST_FILL_DETAILS: string[] = []

const SERVICES_POST_CUTOUT_DETAILS = [
  // Top/bottom separation line
  "M8.31 45.85 L90.82 45.85 L90.82 48.10 L8.31 48.10 Z",

  // Left latch
  "M23.55 42.52 L29.87 42.52 L29.87 52.30 L23.55 52.30 Z",

  // Right latch
  "M69.55 42.52 L75.88 42.52 L75.88 52.30 L69.55 52.30 Z",

  // Center medical cross
  "M47.80 55.80 L52.20 55.80 L53.20 56.80 L53.20 64.80 L61.20 64.80 L62.20 65.80 L62.20 70.20 L61.20 71.20 L53.20 71.20 L53.20 79.20 L52.20 80.20 L47.80 80.20 L46.80 79.20 L46.80 71.20 L38.80 71.20 L37.80 70.20 L37.80 65.80 L38.80 64.80 L46.80 64.80 L46.80 56.80 Z",
]

const PROCESS_PRE_BASE_PATHS = "M58 22 L78 42 L36 84 L16 64 Z"

const PROCESS_PRE_FILL_DETAILS = [
  // Pencil top/cap
  "M70 10 L90 30 L82 38 L62 18 Z",

  // Pencil tip
  "M13 67 L33 87 L9 91 Z",
]

const PROCESS_POST_BASE_PATHS =
  "M20.18 20.81 L17.96 23.67 L17.96 85.21 L18.59 86.80 L20.81 88.70 L22.08 89.02 L75.06 89.02 L77.60 87.75 L79.19 84.90 L79.19 24.30 L78.23 22.08 L77.28 21.13 L74.74 20.18 L66.81 20.18 L66.50 20.50 L66.50 26.52 L64.28 28.74 L32.87 28.74 L30.65 26.52 L30.65 20.50 L30.33 20.18 L22.08 20.18 Z"

const PROCESS_POST_FILL_DETAILS = [
  // Clipboard clip
  "M32.55 18.59 L34.46 17.32 L41.75 17.32 L42.39 15.10 L44.29 12.57 L46.83 11.30 L50.32 11.30 L52.22 12.25 L54.12 14.15 L55.39 17.32 L62.69 17.32 L64.28 18.59 L64.59 25.57 L63.96 26.52 L33.82 26.52 L32.55 25.57 Z",
]

const PROCESS_POST_CUTOUT_DETAILS = [
  // Small top hole/detail
  "M48.10 15.10 L49.68 15.42 L50.95 17.32 L50.63 18.59 L49.37 19.86 L47.46 19.86 L46.19 18.59 L46.19 16.69 Z",

  // Checklist text lines
  "M44.29 41.43 L45.56 40.48 L70.94 40.48 L72.21 41.43 L72.52 42.70 L71.26 43.97 L45.24 43.97 L44.29 43.02 Z",
  "M43.97 58.57 L45.24 56.98 L71.26 56.98 L72.52 58.25 L72.21 59.52 L70.94 60.47 L45.88 60.47 L44.92 60.15 Z",
  "M43.97 74.74 L44.92 73.48 L71.26 73.48 L72.52 74.74 L72.52 76.01 L71.57 76.65 L45.24 76.65 L44.29 76.01 Z",

  // Checkmarks
  "M38.90 37.31 L38.90 38.90 L31.28 47.46 L29.70 47.46 L24.94 42.70 L25.26 41.12 L26.21 40.48 L27.16 40.48 L30.33 43.66 L36.68 36.68 L38.26 36.68 Z",
  "M38.90 53.81 L38.90 55.39 L30.97 63.96 L30.01 63.96 L28.74 63.01 L24.94 58.88 L24.94 57.93 L25.89 56.98 L27.16 56.98 L30.01 59.83 L30.65 59.83 L36.68 53.17 L37.63 52.86 Z",
  "M38.90 70.30 L38.90 71.57 L30.65 80.46 L29.70 80.14 L24.94 75.38 L24.94 74.43 L26.84 73.16 L30.33 76.33 L36.68 69.35 L37.94 69.35 Z",
]

const FAQ_PRE_BASE_PATHS =
  "M49.5 12 C35.5 12 25.5 20.5 25.5 34 L39.5 34 C39.5 27.5 43.5 23.5 49.5 23.5 C56 23.5 60 27.5 60 33 C60 38 57.5 41 51.5 45 C43.5 50.5 40.5 56.5 40.5 66.5 L54 66.5 C54 60.5 56.5 57.5 63 53 C71 47.5 75 41.5 75 32 C75 19.5 65 12 49.5 12 Z M47.5 74 C42.5 74 38.8 77.7 38.8 82.5 C38.8 87.4 42.5 91 47.5 91 C52.5 91 56.2 87.4 56.2 82.5 C56.2 77.7 52.5 74 47.5 74 Z"

const FAQ_POST_BASE_PATHS =
  "M38.5 70.5 L16 48 L26 38 L38.5 50.5 L74 15 L84 25 Z"

const MORPH_PATHS: Record<MorphKind, MorphIconPaths> = {
  website: {
    preBase: WEBSITE_PRE_BASE_PATHS,
    postBase: WEBSITE_POST_BASE_PATHS,
    postFillDetails: WEBSITE_POST_FILL_DETAILS,
    postCutoutDetails: WEBSITE_POST_CUTOUT_DETAILS,
    origin: "50% 50%",
    shapeIndex: "auto",
  },
  services: {
    preBase: SERVICES_PRE_BASE_PATHS,
    preFillDetails: SERVICES_PRE_FILL_DETAILS,
    postBase: SERVICES_POST_BASE_PATHS,
    postFillDetails: SERVICES_POST_FILL_DETAILS,
    postCutoutDetails: SERVICES_POST_CUTOUT_DETAILS,
    origin: "50% 50%",
    shapeIndex: "auto",
  },
  process: {
    preBase: PROCESS_PRE_BASE_PATHS,
    preFillDetails: PROCESS_PRE_FILL_DETAILS,
    postBase: PROCESS_POST_BASE_PATHS,
    postFillDetails: PROCESS_POST_FILL_DETAILS,
    postCutoutDetails: PROCESS_POST_CUTOUT_DETAILS,
    origin: "50% 50%",
    shapeIndex: "auto",
  },
  faq: {
    preBase: FAQ_PRE_BASE_PATHS,
    postBase: FAQ_POST_BASE_PATHS,
    origin: "50% 50%",
    shapeIndex: "auto",
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

export function ScrollMorphDot({
  kind,
  className,
  shapeIndex,
  morphOrigin,
}: ScrollMorphDotProps) {
  const gradientId = `${useId().replace(/:/g, "")}-scroll-morph-gradient`
  const cutoutMaskId = `${gradientId}-cutout-mask`

  const rootRef = useRef<HTMLSpanElement | null>(null)
  const morphPathRef = useRef<SVGPathElement | null>(null)
  const targetPathRef = useRef<SVGPathElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const paths = MORPH_PATHS[kind]
  const gradientPaint = gradient(gradientId)

  const activeShapeIndex = shapeIndex ?? paths.shapeIndex ?? "auto"
  const activeOrigin = morphOrigin ?? paths.origin ?? "50% 50%"

  const preFillDetailsKey = paths.preFillDetails?.join("|") ?? ""
  const postFillDetailsKey = paths.postFillDetails?.join("|") ?? ""
  const postCutoutDetailsKey = paths.postCutoutDetails?.join("|") ?? ""

  useGSAP(
    () => {
      const root = rootRef.current
      const morphPath = morphPathRef.current
      const targetPath = targetPathRef.current

      if (!root || !morphPath || !targetPath) return

      const trigger = root.parentElement ?? root

      const preFillDetails = Array.from(
        root.querySelectorAll<SVGPathElement>(".morph-pre-fill-detail"),
      )

      const postFillDetails = Array.from(
        root.querySelectorAll<SVGPathElement>(".morph-post-fill-detail"),
      )

      const postCutoutDetails = Array.from(
        root.querySelectorAll<SVGPathElement>(".morph-post-cutout-detail"),
      )

      if (shouldReduceMotion) {
        gsap.set(morphPath, {
          attr: {
            d: paths.postBase,
            fill: gradientPaint,
            stroke: "none",
          },
        })

        gsap.set(preFillDetails, {
          opacity: 0,
          scale: 0.985,
          transformOrigin: activeOrigin,
        })

        gsap.set(postFillDetails, {
          opacity: 1,
          scale: 1,
          transformOrigin: activeOrigin,
        })

        gsap.set(postCutoutDetails, {
          attr: { opacity: 1 },
        })

        return
      }

      gsap.set(morphPath, {
        attr: {
          d: paths.preBase,
          fill: gradientPaint,
          stroke: "none",
        },
      })

      gsap.set(preFillDetails, {
        opacity: 1,
        scale: 1,
        transformOrigin: activeOrigin,
      })

      gsap.set(postFillDetails, {
        opacity: 0,
        scale: 0.985,
        transformOrigin: activeOrigin,
      })

      gsap.set(postCutoutDetails, {
        attr: { opacity: 0 },
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top 60%",
          end: "top 25%",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      })

      if (preFillDetails.length) {
        timeline.to(
          preFillDetails,
          {
            opacity: 0,
            scale: 0.985,
            stagger: 0.025,
            ease: "power1.out",
            duration: 0.18,
          },
          0,
        )
      }

      timeline.to(
        morphPath,
        {
          attr: {
            fill: gradientPaint,
            stroke: "none",
          },
          morphSVG: {
            shape: targetPath,
            shapeIndex: activeShapeIndex,
            map: "position",
          },
          ease: "power2.inOut",
          duration: 0.9,
        },
        0.08,
      )

      if (postFillDetails.length) {
  if (kind === "website") {
    const [topBar, bottomBar, stand] = postFillDetails

    timeline
      // top browser bar appears after the screen is mostly formed
      .to(
        topBar,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.32,
        },
        0.8,
      )
      // bottom monitor bar appears after the top bar
      .to(
        bottomBar,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.34,
        },
        1,
      )
      // stand appears last
      .to(
        stand,
        {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          duration: 0.34,
        },
        1.32,
      )
  } else {
    timeline.to(
      postFillDetails,
      {
        opacity: 1,
        scale: 1,
        stagger: 0.04,
        ease: "power2.out",
        duration: 0.34,
      },
      0.92,
    )
  }
}

if (postCutoutDetails.length) {
  if (kind === "services") {
    const [seam, leftLatch, rightLatch, cross] = postCutoutDetails

    timeline
      // seam + latches appear together as one horizontal/top toolbox detail group
      .to(
        [seam, leftLatch, rightLatch],
        {
          attr: { opacity: 1 },
          ease: "power2.out",
          duration: 0.34,
        },
        1.12,
      )
      // cross appears slightly after, centered lower on the toolbox
      .to(
        cross,
        {
          attr: { opacity: 1 },
          ease: "power2.out",
          duration: 0.38,
        },
        1.28,
      )
  } else {
    timeline.to(
      postCutoutDetails,
      {
        attr: { opacity: 1 },
        stagger: 0.04,
        ease: "power2.out",
        duration: 0.42,
      },
      1.08,
    )
  }
}
    },
    {
      dependencies: [
        activeOrigin,
        activeShapeIndex,
        gradientPaint,
        kind,
        paths.preBase,
        paths.postBase,
        preFillDetailsKey,
        postFillDetailsKey,
        postCutoutDetailsKey,
        shouldReduceMotion,
      ],
      revertOnUpdate: true,
      scope: rootRef,
    },
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
            <stop offset="0%" stopColor="#ff981f" />
            <stop offset="52%" stopColor="#ff5d8e" />
            <stop offset="100%" stopColor="#b86cff" />
          </linearGradient>

          {/*
            White = visible.
            Black = transparent cutout.
            The black paths animate opacity 0 -> 1, so the holes fade in.
          */}
          <mask
            id={cutoutMaskId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="-20"
            y="-20"
            width="140"
            height="140"
          >
            <rect x="-20" y="-20" width="140" height="140" fill="white" />

            {paths.postCutoutDetails?.map((detailPath, index) => (
              <path
                key={`${kind}-post-cutout-${index}`}
                className="morph-post-cutout-detail"
                d={detailPath}
                fill="black"
                opacity={shouldReduceMotion ? 1 : 0}
              />
            ))}
          </mask>
        </defs>

        {/* Everything in this group can receive delayed transparent cutouts. */}
        <g mask={`url(#${cutoutMaskId})`}>
          {/* Main morphing silhouette only. */}
          <path
            ref={morphPathRef}
            d={shouldReduceMotion ? paths.postBase : paths.preBase}
            fill={gradientPaint}
            fillRule="evenodd"
            clipRule="evenodd"
            stroke="none"
          />

          {/* Starting filled details fade out. */}
          {paths.preFillDetails?.map((detailPath, index) => (
            <path
              key={`${kind}-pre-fill-${index}`}
              className="morph-pre-fill-detail"
              d={detailPath}
              fill={gradientPaint}
              fillRule="evenodd"
              clipRule="evenodd"
              stroke="none"
              opacity={shouldReduceMotion ? 0 : 1}
            />
          ))}

          {/* Final filled details fade in later. */}
          {paths.postFillDetails?.map((detailPath, index) => (
            <path
              key={`${kind}-post-fill-${index}`}
              className="morph-post-fill-detail"
              d={detailPath}
              fill={gradientPaint}
              fillRule="evenodd"
              clipRule="evenodd"
              stroke="none"
              opacity={shouldReduceMotion ? 1 : 0}
            />
          ))}
        </g>

        {/* Hidden MorphSVG target. Only the simplified final base shape. */}
        <path
          ref={targetPathRef}
          d={paths.postBase}
          fill={gradientPaint}
          fillRule="evenodd"
          clipRule="evenodd"
          stroke="none"
          visibility="hidden"
        />
      </svg>
    </span>
  )
}
