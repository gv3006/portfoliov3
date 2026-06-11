"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger)

const DEBUG_FLOW_LINE = false
const MIN_FLOW_LINE_WIDTH_PX = 768
const FLOW_POINTS_STORAGE_KEY = "site-flow-line-points-v1"

// Lower = tighter / straighter.
// Higher = looser / more flowy.
const FLOW_LINE_TENSION = 1
const DISABLE_FLOW_LINE = true

interface FlowLineSize {
  width: number
  height: number
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

const FLOW_POINTS: FlowPoint[] = [
  { x: 0.56, y: 0 },
  { x: 0.623, y: 0.021 },
  { x: 0.736, y: 0.03 },
  { x: 0.93, y: 0.038 },
  { x: 0.959, y: 0.077 },
  { x: 0.963, y: 0.145 },
  { x: 0.54, y: 0.168 },
  { x: 0.281, y: 0.279 },
  { x: 0.513, y: 0.267 },
  { x: 0.625, y: 0.282 },
  { x: 0.815, y: 0.274 },
  { x: 0.923, y: 0.297 },
  { x: 0.933, y: 0.345 },
  { x: 0.968, y: 0.408 },
  { x: 0.768, y: 0.429 },
  { x: 0.48, y: 0.42 },
  { x: 0.285, y: 0.433 },
  { x: 0.429, y: 0.453 },
  { x: 0.414, y: 0.471 },
  { x: 0.415, y: 0.652 },
  { x: 0.453, y: 0.675 },
  { x: 0.3, y: 0.692 },
  { x: 0.432, y: 0.702 },
  { x: 0.39, y: 0.761 },
  { x: 0.212, y: 0.806 },
  { x: 0.871, y: 0.794 },
  { x: 0.912, y: 0.907 },
  { x: 0.474, y: 0.911 },
  { x: 0.386, y: 0.925 },
  { x: 0.731, y: 0.944 },
  { x: 0.58, y: 1 },
]

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function isValidFlowPoints(value: unknown): value is FlowPoint[] {
  if (!Array.isArray(value) || value.length < 2) {
    return false
  }

  return value.every((point) => {
    if (!point || typeof point !== "object") {
      return false
    }

    const possiblePoint = point as Partial<FlowPoint>

    return (
      typeof possiblePoint.x === "number" &&
      typeof possiblePoint.y === "number" &&
      possiblePoint.x >= 0 &&
      possiblePoint.x <= 1 &&
      possiblePoint.y >= 0 &&
      possiblePoint.y <= 1
    )
  })
}

function formatNumber(value: number) {
  return Number(value.toFixed(3))
}

function formatFlowPointsCode(points: FlowPoint[]) {
  const pointLines = points
    .map(
      (point) =>
        `  { x: ${formatNumber(point.x)}, y: ${formatNumber(point.y)} },`,
    )
    .join("\n")

  return `const FLOW_POINTS: FlowPoint[] = [\n${pointLines}\n]`
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

function getDistance(pointA: ScaledFlowPoint, pointB: ScaledFlowPoint) {
  return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y)
}

function getSquaredDistanceToSegment(
  point: FlowPoint,
  segmentStart: FlowPoint,
  segmentEnd: FlowPoint,
) {
  const dx = segmentEnd.x - segmentStart.x
  const dy = segmentEnd.y - segmentStart.y

  if (dx === 0 && dy === 0) {
    const pointDx = point.x - segmentStart.x
    const pointDy = point.y - segmentStart.y

    return pointDx * pointDx + pointDy * pointDy
  }

  const t = clamp(
    ((point.x - segmentStart.x) * dx + (point.y - segmentStart.y) * dy) /
      (dx * dx + dy * dy),
    0,
    1,
  )

  const projectedX = segmentStart.x + t * dx
  const projectedY = segmentStart.y + t * dy

  const distanceX = point.x - projectedX
  const distanceY = point.y - projectedY

  return distanceX * distanceX + distanceY * distanceY
}

function getInsertionIndexForNewPoint(newPoint: FlowPoint, points: FlowPoint[]) {
  if (points.length < 2) {
    return points.length
  }

  let bestSegmentIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY

  for (let index = 0; index < points.length - 1; index++) {
    const distance = getSquaredDistanceToSegment(
      newPoint,
      points[index],
      points[index + 1],
    )

    if (distance < bestDistance) {
      bestDistance = distance
      bestSegmentIndex = index
    }
  }

  return bestSegmentIndex + 1
}

function getTangentAtPoint(
  points: ScaledFlowPoint[],
  index: number,
  tension: number,
) {
  const currentPoint = points[index]

  if (index === 0) {
    const nextPoint = points[index + 1]
    const distance = getDistance(currentPoint, nextPoint)

    if (distance === 0) {
      return { x: 0, y: 0 }
    }

    return {
      x: (nextPoint.x - currentPoint.x) * tension,
      y: (nextPoint.y - currentPoint.y) * tension,
    }
  }

  if (index === points.length - 1) {
    const previousPoint = points[index - 1]
    const distance = getDistance(previousPoint, currentPoint)

    if (distance === 0) {
      return { x: 0, y: 0 }
    }

    return {
      x: (currentPoint.x - previousPoint.x) * tension,
      y: (currentPoint.y - previousPoint.y) * tension,
    }
  }

  const previousPoint = points[index - 1]
  const nextPoint = points[index + 1]

  const incomingDistance = getDistance(previousPoint, currentPoint)
  const outgoingDistance = getDistance(currentPoint, nextPoint)
  const maxTangentLength = Math.min(incomingDistance, outgoingDistance) * tension

  const dx = nextPoint.x - previousPoint.x
  const dy = nextPoint.y - previousPoint.y
  const distance = Math.hypot(dx, dy)

  if (distance === 0) {
    return { x: 0, y: 0 }
  }

  return {
    x: (dx / distance) * maxTangentLength,
    y: (dy / distance) * maxTangentLength,
  }
}

function buildSmoothPathFromScaledPoints(points: ScaledFlowPoint[]) {
  if (points.length < 2) {
    return ""
  }

  const commands = [`M ${points[0].x} ${points[0].y}`]

  const tangents = points.map((_, index) =>
    getTangentAtPoint(points, index, FLOW_LINE_TENSION),
  )

  for (let index = 0; index < points.length - 1; index++) {
    const currentPoint = points[index]
    const nextPoint = points[index + 1]

    const currentTangent = tangents[index]
    const nextTangent = tangents[index + 1]

    const controlPointOneX = currentPoint.x + currentTangent.x / 3
    const controlPointOneY = currentPoint.y + currentTangent.y / 3

    const controlPointTwoX = nextPoint.x - nextTangent.x / 3
    const controlPointTwoY = nextPoint.y - nextTangent.y / 3

    commands.push(
      `C ${controlPointOneX} ${controlPointOneY}, ${controlPointTwoX} ${controlPointTwoY}, ${nextPoint.x} ${nextPoint.y}`,
    )
  }

  return commands.join(" ")
}

function buildFlowPath({
  width,
  height,
  points,
}: FlowLineSize & { points: FlowPoint[] }) {
  const { startY, endY } = getVerticalBounds(height)
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
  })

  const [flowPoints, setFlowPoints] = useState<FlowPoint[]>(FLOW_POINTS)
  const [hasLoadedSavedPoints, setHasLoadedSavedPoints] = useState(false)
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null)
  const [isAddPointMode, setIsAddPointMode] = useState(false)
  const [isDeletePointMode, setIsDeletePointMode] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  const measure = useCallback(() => {
    const root = rootRef.current
    const parent = root?.parentElement

    if (!root || !parent) {
      return
    }

    setSize({
      width: Math.round(parent.clientWidth),
      height: Math.round(parent.scrollHeight),
    })
  }, [])

  useEffect(() => {
    try {
      const savedPoints = window.localStorage.getItem(FLOW_POINTS_STORAGE_KEY)

      if (savedPoints) {
        const parsedPoints = JSON.parse(savedPoints)

        if (isValidFlowPoints(parsedPoints)) {
          setFlowPoints(parsedPoints)
        }
      }
    } catch {
      console.log("Could not load saved flow points.")
    } finally {
      setHasLoadedSavedPoints(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedSavedPoints) {
      return
    }

    try {
      window.localStorage.setItem(
        FLOW_POINTS_STORAGE_KEY,
        JSON.stringify(flowPoints),
      )
    } catch {
      console.log("Could not save flow points.")
    }
  }, [flowPoints, hasLoadedSavedPoints])

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
    window.addEventListener("load", scheduleMeasure)

    if ("fonts" in document) {
      void document.fonts.ready.then(scheduleMeasure)
    }

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", scheduleMeasure)
      window.removeEventListener("load", scheduleMeasure)

      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current)
      }
    }
  }, [measure])

  useEffect(() => {
    if (!DEBUG_FLOW_LINE) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return
      }

      const target = event.target

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return
      }

      if (event.code === "KeyA") {
        event.preventDefault()

        setIsDeletePointMode(false)
        setIsAddPointMode((currentValue) => !currentValue)
        setCopyStatus(
          "Add mode active. Click anywhere on the overlay to insert a new point.",
        )
      }

      if (event.key === "Escape") {
        setIsAddPointMode(false)
        setIsDeletePointMode(false)
        setDraggedPointIndex(null)
        setCopyStatus("Canceled add/delete mode.")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const hasSize = size.width > 0 && size.height > 0
  const shouldShowFlowLine = hasSize && size.width >= MIN_FLOW_LINE_WIDTH_PX

  const pathD = shouldShowFlowLine
    ? buildFlowPath({
        width: size.width,
        height: size.height,
        points: flowPoints,
      })
    : ""

  const { startY, endY } = getVerticalBounds(size.height)

  const debugPoints = shouldShowFlowLine
    ? scaleFlowPoints(flowPoints, size.width, startY, endY)
    : []

  const getNormalizedPointFromClientPosition = useCallback(
    (clientX: number, clientY: number): FlowPoint | null => {
      const root = rootRef.current

      if (!root || !shouldShowFlowLine) {
        return null
      }

      const rect = root.getBoundingClientRect()

      if (rect.width === 0 || rect.height === 0) {
        return null
      }

      const screenX = clientX - rect.left
      const screenY = clientY - rect.top

      const svgX = (screenX / rect.width) * size.width
      const svgY = (screenY / rect.height) * size.height

      const rawX = svgX / size.width
      const rawY = (svgY - startY) / (endY - startY)

      return {
        x: clamp(rawX, 0, 1),
        y: clamp(rawY, 0, 1),
      }
    },
    [shouldShowFlowLine, size.width, size.height, startY, endY],
  )

  const addPointAtClientPosition = useCallback(
    (clientX: number, clientY: number) => {
      const newPoint = getNormalizedPointFromClientPosition(clientX, clientY)

      if (!newPoint) {
        setCopyStatus("Click inside the flow-line overlay area.")
        return
      }

      setFlowPoints((currentPoints) => {
        const insertionIndex = getInsertionIndexForNewPoint(
          newPoint,
          currentPoints,
        )

        return [
          ...currentPoints.slice(0, insertionIndex),
          newPoint,
          ...currentPoints.slice(insertionIndex),
        ]
      })

      setIsAddPointMode(false)
      setIsDeletePointMode(false)
      setCopyStatus("Point added. Drag it to fine-tune, then copy the code.")
    },
    [getNormalizedPointFromClientPosition],
  )

  const updateDraggedPoint = useCallback(
    (index: number, clientX: number, clientY: number) => {
      const nextPoint = getNormalizedPointFromClientPosition(clientX, clientY)

      if (!nextPoint) {
        return
      }

      setFlowPoints((currentPoints) =>
        currentPoints.map((point, pointIndex) =>
          pointIndex === index ? nextPoint : point,
        ),
      )

      setCopyStatus(null)
    },
    [getNormalizedPointFromClientPosition],
  )

  const handlePointPointerDown = useCallback(
    (index: number, event: ReactPointerEvent<SVGCircleElement>) => {
      if (!DEBUG_FLOW_LINE) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (isDeletePointMode) {
        setFlowPoints((currentPoints) => {
          if (currentPoints.length <= 2) {
            setCopyStatus("You need at least 2 points.")
            return currentPoints
          }

          return currentPoints.filter((_, pointIndex) => pointIndex !== index)
        })

        setCopyStatus("Point deleted. Copy the code when done.")
        return
      }

      setIsAddPointMode(false)
      setDraggedPointIndex(index)
      updateDraggedPoint(index, event.clientX, event.clientY)
    },
    [isDeletePointMode, updateDraggedPoint],
  )

  const handleSvgPointerDown = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (!DEBUG_FLOW_LINE || !isAddPointMode) {
        return
      }

      event.preventDefault()
      addPointAtClientPosition(event.clientX, event.clientY)
    },
    [addPointAtClientPosition, isAddPointMode],
  )

  useEffect(() => {
    if (draggedPointIndex === null) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault()
      updateDraggedPoint(draggedPointIndex, event.clientX, event.clientY)
    }

    const handlePointerUp = () => {
      setDraggedPointIndex(null)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("pointercancel", handlePointerUp)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerUp)
    }
  }, [draggedPointIndex, updateDraggedPoint])

  const handleCopyPointsCode = useCallback(async () => {
    const code = formatFlowPointsCode(flowPoints)

    try {
      await navigator.clipboard.writeText(code)
      setCopyStatus("Copied. Paste this over FLOW_POINTS.")
      console.log(code)
    } catch {
      setCopyStatus("Could not copy. Code printed in console.")
      console.log(code)
    }
  }, [flowPoints])

  const handleResetPoints = useCallback(() => {
    setFlowPoints(FLOW_POINTS)
    setIsAddPointMode(false)
    setIsDeletePointMode(false)
    setCopyStatus("Reset to default points.")
  }, [])

  const handleAddPointMode = useCallback(() => {
    setIsDeletePointMode(false)
    setIsAddPointMode((currentValue) => !currentValue)
    setCopyStatus("Add mode active. Click anywhere on the overlay to insert a new point.")
  }, [])

  const handleDeletePointMode = useCallback(() => {
    setIsAddPointMode(false)
    setIsDeletePointMode((currentValue) => !currentValue)
    setCopyStatus("Click a point to delete it.")
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      const path = pathRef.current

      if (!root || !path || !pathD) {
        return
      }

      gsap.set(path, {
        drawSVG: DEBUG_FLOW_LINE || shouldReduceMotion ? "0% 100%" : "0% 0%",
      })

      if (DEBUG_FLOW_LINE || shouldReduceMotion) {
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
      className={
        DEBUG_FLOW_LINE
          ? "absolute inset-0 z-[9999] hidden overflow-visible md:block"
          : "pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      }
      aria-hidden={!DEBUG_FLOW_LINE}
    >
      {DEBUG_FLOW_LINE ? (
        <div
          className="fixed left-4 top-4 z-[10000] max-w-sm rounded-xl border border-neutral-200 bg-white/95 p-3 text-xs text-neutral-900 shadow-xl backdrop-blur"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="font-semibold">Flow line designer</div>

          <div className="mt-1 text-neutral-600">
            Drag points. Press A to enter add mode, then click the page. Delete
            removes a clicked point.
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAddPointMode}
              className={
                isAddPointMode
                  ? "rounded-md bg-teal-700 px-3 py-1.5 font-medium text-white hover:bg-teal-800"
                  : "rounded-md border border-neutral-300 px-3 py-1.5 font-medium text-neutral-900 hover:bg-neutral-100"
              }
            >
              {isAddPointMode ? "Adding: click page" : "Add point"}
            </button>

            <button
              type="button"
              onClick={handleDeletePointMode}
              className={
                isDeletePointMode
                  ? "rounded-md bg-red-700 px-3 py-1.5 font-medium text-white hover:bg-red-800"
                  : "rounded-md border border-neutral-300 px-3 py-1.5 font-medium text-neutral-900 hover:bg-neutral-100"
              }
            >
              {isDeletePointMode ? "Deleting: click point" : "Delete point"}
            </button>

            <button
              type="button"
              onClick={handleCopyPointsCode}
              className="rounded-md bg-neutral-950 px-3 py-1.5 font-medium text-white hover:bg-neutral-800"
            >
              Copy FLOW_POINTS code
            </button>

            <button
              type="button"
              onClick={handleResetPoints}
              className="rounded-md border border-neutral-300 px-3 py-1.5 font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Reset
            </button>
          </div>

          {copyStatus ? (
            <div className="mt-2 font-medium text-teal-700">{copyStatus}</div>
          ) : null}

          <div className="mt-2 text-neutral-500">
            Current point count: {flowPoints.length}
          </div>
        </div>
      ) : null}

      {pathD ? (
        <svg
          className={
            isAddPointMode
              ? "h-full w-full cursor-crosshair"
              : "h-full w-full"
          }
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
          onPointerDown={handleSvgPointerDown}
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

          {DEBUG_FLOW_LINE
            ? debugPoints.map((point, index) => {
                const pointColor =
                  draggedPointIndex === index
                    ? "blue"
                    : isDeletePointMode
                      ? "orange"
                      : "red"

                return (
                  <g key={`${point.originalX}-${point.originalY}-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="9"
                      fill={pointColor}
                      stroke="white"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      style={{
                        cursor:
                          draggedPointIndex === index ? "grabbing" : "grab",
                        touchAction: "none",
                      }}
                      onPointerDown={(event) =>
                        handlePointPointerDown(index, event)
                      }
                    />

                    <text
                      x={point.x + 12}
                      y={point.y - 10}
                      fill={pointColor}
                      fontSize="14"
                      fontWeight="700"
                      pointerEvents="none"
                      vectorEffect="non-scaling-stroke"
                    >
                      {index + 1}: x {formatNumber(point.originalX)}, y{" "}
                      {formatNumber(point.originalY)}
                    </text>
                  </g>
                )
              })
            : null}
        </svg>
      ) : null}
    </div>
  )
}