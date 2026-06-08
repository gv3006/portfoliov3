"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Project {
  id: number
  title: string
  category: string
  year: string
  thumbnail: string
  video: string
}

interface VideoCardProps {
  project: Project
  isHovered: boolean
  isDimmed: boolean
  onHoverChange: (hovered: boolean) => void
  isMobileLayout?: boolean
}

export function VideoCard({ project, isHovered, isDimmed, onHoverChange, isMobileLayout = false }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const showDetails = isMobileLayout || isHovered

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovered])

  return (
    <div
      className={cn(
        "group relative flex-none overflow-hidden rounded-[1.5rem] bg-neutral-100 md:rounded-[2.5rem]",
        "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        "h-[420px] w-[78vw] max-w-[22rem] md:h-[600px] md:w-auto md:max-w-none md:min-w-[180px]",
        isHovered ? "md:flex-[2] md:shadow-2xl md:shadow-cyan-950/15" : "md:flex-[0.8]",
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Thumbnail Image */}
      <div className="absolute inset-0">
        <img
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          className={cn(
            "w-full h-full object-cover object-top origin-top transition-all duration-700",
            !showDetails && "grayscale brightness-75",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-700",
            isDimmed ? "opacity-45" : "opacity-0",
          )}
        />
      </div>

      {/* Video */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", isHovered ? "opacity-100" : "opacity-0")}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-top origin-top"
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={project.video} type="video/mp4" />
        </video>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 md:p-8",
          showDetails ? "" : "pointer-events-none",
        )}
      >
        {/* Glassmorphic card */}
        <div
          className={cn(
            "relative rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl md:bg-black/20 md:p-6",
            "shadow-2xl",
            "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            showDetails ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <div className="space-y-1 text-left">
            <h3 className="text-white font-mono text-xs tracking-[0.2em] uppercase font-medium leading-relaxed md:text-sm md:tracking-[0.3em]">
              {project.title}
            </h3>
            <p className="text-white/80 font-mono text-[0.68rem] tracking-[0.18em] uppercase leading-relaxed md:text-xs md:tracking-[0.25em]">
              {project.category}
            </p>
            <div className="pt-3 mt-3 border-t border-white/10">
              <p className="text-white/60 font-mono text-xs tracking-widest">{project.year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
