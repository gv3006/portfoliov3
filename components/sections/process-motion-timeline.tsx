"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { ProcessPreview } from "@/components/sample-graphics"
import { GsapSlotNumber } from "@/components/gsap-slot-number"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, MotionPathPlugin, ScrollTrigger)

export interface ProcessTimelineStep {
  number: string
  title: string
  description: string
  label: string
  preview: string
}

interface ProcessMotionTimelineProps {
  steps: ProcessTimelineStep[]
}

interface Point {
  x: number
  y: number
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

function buildPath(points: Point[]) {
  if (points.length === 0) {
    return ""
  }

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index]
    const verticalDistance = Math.max(Math.abs(point.y - previous.y), 96)
    const curveOffset = Math.min(verticalDistance * 0.52, 220)

    return `${path} C ${previous.x} ${previous.y + curveOffset}, ${point.x} ${
      point.y - curveOffset
    }, ${point.x} ${point.y}`
  }, `M ${points[0].x} ${points[0].y}`)
}

function buildSegmentPath(from: Point, to: Point) {
  const verticalDistance = Math.max(Math.abs(to.y - from.y), 96)
  const curveOffset = Math.min(verticalDistance * 0.52, 220)

  return `M ${from.x} ${from.y} C ${from.x} ${from.y + curveOffset}, ${to.x} ${
    to.y - curveOffset
  }, ${to.x} ${to.y}`
}

function MedicalCross() {
  return (
    <>
      <circle className="process-motion-cross-halo" r="24" fill="rgba(8,145,178,0.13)" />
      <circle r="16" fill="#ffffff" stroke="rgba(8,145,178,0.58)" strokeWidth="1.5" />
      <path d="M-4 -10 H4 V-4 H10 V4 H4 V10 H-4 V4 H-10 V-4 H-4 Z" fill="#0e7490" />
    </>
  )
}

export function ProcessMotionTimeline({ steps }: ProcessMotionTimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const progressPathRef = useRef<SVGPathElement>(null)
  const markerRef = useRef<SVGGElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const resizeFrameRef = useRef<number | null>(null)

  const [pathD, setPathD] = useState("")
  const [startPoint, setStartPoint] = useState<Point>({ x: 32, y: 0 })
  const [points, setPoints] = useState<Point[]>([])

  const shouldReduceMotion = useReducedMotion()

  const calculatePath = useCallback(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const rootRect = root.getBoundingClientRect()
    const isTwoColumn = window.matchMedia("(min-width: 768px)").matches

    const points = cardRefs.current.flatMap((card, index) => {
      if (!card) {
        return []
      }

      const cardRect = card.getBoundingClientRect()
      const y = cardRect.top - rootRect.top + cardRect.height / 2

      if (!isTwoColumn) {
        return [{ x: 30, y }]
      }

      const isLeftCard = index % 2 === 0
      const edgeX = isLeftCard ? cardRect.right - rootRect.left : cardRect.left - rootRect.left

      return [{ x: edgeX, y }]
    })

    setPoints(points)
    setStartPoint(points[0] ?? { x: 32, y: 0 })
    setPathD(buildPath(points))
  }, [])

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const schedulePathUpdate = () => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current)
      }

      resizeFrameRef.current = requestAnimationFrame(() => {
        calculatePath()
        ScrollTrigger.refresh()
      })
    }

    calculatePath()

    const resizeObserver = new ResizeObserver(schedulePathUpdate)
    resizeObserver.observe(root)

    cardRefs.current.forEach((card) => {
      if (card) {
        resizeObserver.observe(card)
      }
    })

    window.addEventListener("resize", schedulePathUpdate)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", schedulePathUpdate)

      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current)
      }
    }
  }, [calculatePath, steps.length])

  useGSAP(
    () => {
      const root = rootRef.current
      const path = pathRef.current
      const progressPath = progressPathRef.current
      const marker = markerRef.current

      if (!root || !path || !progressPath || !marker || !pathD || points.length === 0) {
        return
      }

      const halo = marker.querySelector<SVGCircleElement>(".process-motion-cross-halo")
      const pathLength = path.getTotalLength()

      const segmentPaths = points.slice(1).map((point, index) => buildSegmentPath(points[index], point))

      const segmentLengths = segmentPaths.map((segmentPath) => {
        const segment = document.createElementNS("http://www.w3.org/2000/svg", "path")
        segment.setAttribute("d", segmentPath)

        return segment.getTotalLength()
      })

      const measuredSegmentTotal = segmentLengths.reduce((total, length) => total + length, 0)

      // No linger animation. The slow-down comes only from this eased travel.
      const travelDuration = 1.15
      const travelEase = "sine.inOut"

      let revealedLength = 0

      gsap.set(progressPath, {
        strokeDasharray: pathLength,
        strokeDashoffset: shouldReduceMotion ? 0 : pathLength,
      })

      if (!shouldReduceMotion) {
        marker.removeAttribute("transform")
      }

      gsap.set(marker, {
        autoAlpha: 1,
        filter: "drop-shadow(0 10px 18px rgba(8,145,178,0.18))",
        scale: 1,
        transformOrigin: "50% 50%",
        x: shouldReduceMotion ? 0 : startPoint.x,
        y: shouldReduceMotion ? 0 : startPoint.y,
      })

      gsap.set(halo, {
        opacity: shouldReduceMotion ? 0.52 : 0.22,
        scale: 1,
        transformOrigin: "50% 50%",
      })

      if (shouldReduceMotion) {
        return
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 68%",
          end: "bottom 48%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      segmentPaths.forEach((segmentPath, index) => {
        const segmentLength = segmentLengths[index] ?? 0

        revealedLength += measuredSegmentTotal > 0
          ? (segmentLength / measuredSegmentTotal) * pathLength
          : 0

        timeline.to(
          marker,
          {
            duration: travelDuration,
            ease: travelEase,
            motionPath: {
              path: segmentPath,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
          },
          ">",
        )

        timeline.to(
          progressPath,
          {
            duration: travelDuration,
            ease: travelEase,
            strokeDashoffset: Math.max(pathLength - revealedLength, 0),
          },
          "<",
        )
      })
    },
    {
      dependencies: [pathD, points, shouldReduceMotion, startPoint.x, startPoint.y],
      revertOnUpdate: true,
      scope: rootRef,
    },
  )

  return (
    <div ref={rootRef} className="relative mt-10 overflow-hidden py-4 md:mt-16">
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true">
        {pathD ? (
          <>
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="rgba(14,116,144,0.16)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />

            <path
              ref={progressPathRef}
              d={pathD}
              fill="none"
              stroke="url(#process-motion-gradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />

            <g
              ref={markerRef}
              className="drop-shadow-[0_10px_18px_rgba(8,145,178,0.18)]"
              opacity={shouldReduceMotion ? 1 : 0}
              transform={`translate(${startPoint.x} ${startPoint.y})`}
            >
              <MedicalCross />
            </g>
          </>
        ) : null}

        <defs>
          <linearGradient id="process-motion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#0891b2" />
            <stop offset="0.58" stopColor="#14b8a6" />
            <stop offset="1" stopColor="#0e7490" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 space-y-10 pl-11 md:space-y-24 md:pl-0">
        {steps.map((step, index) => {
          const isLeftCard = index % 2 === 0

          return (
            <article
              key={step.number}
              ref={(element) => {
                cardRefs.current[index] = element
              }}
              className={cn(
                "group relative grid max-w-xl gap-5 rounded-2xl border border-neutral-900/10 bg-white/92 p-5 shadow-sm shadow-neutral-900/5 transition-colors duration-300 hover:border-cyan-700/20 hover:bg-white hover:shadow-lg hover:shadow-cyan-950/5 md:w-[46%] md:p-7",
                isLeftCard ? "md:mr-auto" : "md:ml-auto",
              )}
            >
              <div className="flex min-w-0 items-start gap-3 md:gap-4">
                <GsapSlotNumber
                  value={step.number}
                  delay={index * 0.08}
                  ariaLabel={`Step ${step.number}`}
                  className="shrink-0 font-mono text-xs tracking-[0.28em] text-cyan-800/45 md:tracking-[0.35em]"
                />

                <div className="min-w-0">
                  <h3 className="text-balance font-mono text-base uppercase tracking-[0.12em] text-neutral-950 md:text-lg md:tracking-[0.18em]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-pretty text-sm leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </div>

              <ProcessPreview label={step.label} title={step.preview} className="w-full" />
            </article>
          )
        })}
      </div>
    </div>
  )
}
