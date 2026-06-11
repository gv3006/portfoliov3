"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger)

const DEBUG_FLOW_LINE = true
const DESKTOP_BREAKPOINT_PX = 768

interface FlowLineSize {
  width: number
  height: number
  isDesktop: boolean
}

interface FlowPoint {
  x: number
  y: number
}

interface ScaledFlowPoint {
  x: number
  y: number
  originalX: number
  originalY: number
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

function getFlowPoints(isDesktop: boolean): FlowPoint[] {
  if (!isDesktop) {
    return [
      { x: 0.15, y: 0.02 },
      { x: 0.67, y: 0.025 },
      { x: 0.12, y: 0.46 },
      { x: 0.24, y: 0.72 },
      { x: 0.16, y: 1 },
    ]
  }

  return [
    { x: 0.56, y: 0 },
    { x: 0.67, y: 0.025 },
    { x: 0.74, y: 0.5 },
    { x: 0.36, y: 0.76 },
    { x: 0.58, y: 1 },
  ]
}

function getVerticalBounds(height: number) {
  const startY = 10
  const endY = Math.max(height - 20, startY + 1)

  return { startY, endY }
}

function scaleFlowPoints(
  points: FlowPoint[],
  width: number,
  startY: number,
  endY: number,
): ScaledFlowPoint[] {
  const drawableHeight = endY - startY

  return points.map((point) => ({
    x: point.x * width,
    y: startY + point.y * drawableHeight,
    originalX: point.x,
    originalY: point.y,
  }))
}

function buildSmoothPathFromScaledPoints(points: ScaledFlowPoint[]) {
  if (points.length < 2) {
    return ""
  }

  const commands = [`M ${points[0].x} ${points[0].y}`]

  for (let index = 0; index < points.length - 1; index++) {
    const previousPoint = points[index - 1] ?? points[index]
    const currentPoint = points[index]
    const nextPoint = points[index + 1]
    const followingPoint = points[index + 2] ?? nextPoint

    const controlPointOneX = currentPoint.x + (nextPoint.x - previousPoint.x) / 6
    const controlPointOneY = currentPoint.y + (nextPoint.y - previousPoint.y) / 6

    const controlPointTwoX = nextPoint.x - (followingPoint.x - currentPoint.x) / 6
    const controlPointTwoY = nextPoint.y - (followingPoint.y - currentPoint.y) / 6

    commands.push(
      `C ${controlPointOneX} ${controlPointOneY}, ${controlPointTwoX} ${controlPointTwoY}, ${nextPoint.x} ${nextPoint.y}`,
    )
  }

  return commands.join(" ")
}

function buildFlowPath({ width, height, isDesktop }: FlowLineSize) {
  const { startY, endY } = getVerticalBounds(height)
  const points = getFlowPoints(isDesktop)
  const scaledPoints = scaleFlowPoints(points, width, startY, endY)

  return buildSmoothPathFromScaledPoints(scaledPoints)
}

export function SiteFlowLine() {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const resizeFrameRef = useRef<number | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const [size, setSize] = useState<FlowLineSize>({
    width: 0,
    height: 0,
    isDesktop: true,
  })

  const [clickedPoint, setClickedPoint] = useState<ScaledFlowPoint | null>(null)

  const measure = useCallback(() => {
    const root = rootRef.current
    const parent = root?.parentElement

    if (!root || !parent) {
      return
    }

    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT_PX

    setSize({
      width: Math.round(parent.clientWidth),
      height: Math.round(parent.scrollHeight),
      isDesktop,
    })
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const parent = root?.parentElement

    if (!root || !parent) {
      return
    }

    const scheduleMeasure = () => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current)
      }

      resizeFrameRef.current = requestAnimationFrame(() => {
        measure()
        ScrollTrigger.refresh()
      })
    }

    measure()

    const resizeObserver = new ResizeObserver(scheduleMeasure)
    resizeObserver.observe(parent)

    window.addEventListener("resize", scheduleMeasure)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", scheduleMeasure)

      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current)
      }
    }
  }, [measure])

  const hasSize = size.width > 0 && size.height > 0
  const pathD = hasSize ? buildFlowPath(size) : ""

  const { startY, endY } = getVerticalBounds(size.height)

  const debugPoints = hasSize
    ? scaleFlowPoints(getFlowPoints(size.isDesktop), size.width, startY, endY)
    : []

  const handleDebugClick = useCallback(
    async (event: MouseEvent<HTMLDivElement>) => {
      if (!DEBUG_FLOW_LINE || !rootRef.current || !hasSize) {
        return
      }

      const rect = rootRef.current.getBoundingClientRect()

      const screenX = event.clientX - rect.left
      const screenY = event.clientY - rect.top

      const svgX = (screenX / rect.width) * size.width
      const svgY = (screenY / rect.height) * size.height

      const rawX = svgX / size.width
      const rawY = (svgY - startY) / (endY - startY)

      const x = Math.min(Math.max(rawX, 0), 1)
      const y = Math.min(Math.max(rawY, 0), 1)

      const clickedSvgPoint: ScaledFlowPoint = {
        x: x * size.width,
        y: startY + y * (endY - startY),
        originalX: x,
        originalY: y,
      }

      setClickedPoint(clickedSvgPoint)

      const pointText = `{ x: ${Number(x.toFixed(3))}, y: ${Number(y.toFixed(3))} }`

      console.log(
        `Flow point for ${size.isDesktop ? "DESKTOP" : "MOBILE"}:`,
        pointText,
      )

      try {
        await navigator.clipboard.writeText(pointText)
        console.log("Copied to clipboard:", pointText)
      } catch {
        console.log("Clipboard copy failed, but point is above.")
      }
    },
    [hasSize, size.width, size.height, size.isDesktop, startY, endY],
  )

  useGSAP(
    () => {
      const root = rootRef.current
      const path = pathRef.current

      if (!root || !path || !pathD) {
        return
      }

      gsap.set(path, {
        drawSVG: shouldReduceMotion ? "0% 100%" : "0% 0%",
      })

      if (shouldReduceMotion) {
        return
      }

      gsap.to(path, {
        drawSVG: "0% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: root.parentElement ?? root,
          start: "top 72%",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          markers: DEBUG_FLOW_LINE,
        },
      })
    },
    {
      dependencies: [pathD, shouldReduceMotion],
      revertOnUpdate: true,
      scope: rootRef,
    },
  )

  return (
    <div
      ref={rootRef}
      onClick={handleDebugClick}
      className={
        DEBUG_FLOW_LINE
          ? "absolute inset-0 z-50 overflow-hidden"
          : "pointer-events-none absolute inset-0 z-0 overflow-hidden"
      }
      aria-hidden="true"
    >
      {pathD ? (
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="site-flow-line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop stopColor="#0891b2" stopOpacity="0.48" />
              <stop offset="0.55" stopColor="#14b8a6" stopOpacity="0.4" />
              <stop offset="1" stopColor="#0e7490" stopOpacity="0.34" />
            </linearGradient>
          </defs>

          <path
            d={pathD}
            fill="none"
            stroke="rgba(14,116,144,0.12)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />

          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="url(#site-flow-line-gradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
            vectorEffect="non-scaling-stroke"
          />

          {DEBUG_FLOW_LINE ? (
            <g>
              <rect
                x="12"
                y="12"
                width="250"
                height="58"
                rx="8"
                fill="white"
                opacity="0.92"
              />

              <text x="24" y="36" fill="black" fontSize="14" fontWeight="700">
                Active: {size.isDesktop ? "DESKTOP POINTS" : "MOBILE POINTS"}
              </text>

              <text x="24" y="58" fill="black" fontSize="12">
                viewport: {typeof window !== "undefined" ? window.innerWidth : 0}px
              </text>
            </g>
          ) : null}

          {DEBUG_FLOW_LINE
            ? debugPoints.map((point, index) => (
                <g key={`${point.originalX}-${point.originalY}-${index}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="7"
                    fill="red"
                    stroke="white"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />

                  <text
                    x={point.x + 12}
                    y={point.y - 10}
                    fill="red"
                    fontSize="14"
                    fontWeight="700"
                    vectorEffect="non-scaling-stroke"
                  >
                    {index + 1}: x {point.originalX}, y {point.originalY}
                  </text>
                </g>
              ))
            : null}

          {DEBUG_FLOW_LINE && clickedPoint ? (
            <g>
              <circle
                cx={clickedPoint.x}
                cy={clickedPoint.y}
                r="9"
                fill="blue"
                stroke="white"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              <text
                x={clickedPoint.x + 14}
                y={clickedPoint.y + 20}
                fill="blue"
                fontSize="14"
                fontWeight="700"
                vectorEffect="non-scaling-stroke"
              >
                clicked: x {clickedPoint.originalX.toFixed(3)}, y{" "}
                {clickedPoint.originalY.toFixed(3)}
              </text>
            </g>
          ) : null}
        </svg>
      ) : null}
    </div>
  )
}